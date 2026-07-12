import os
import shutil
import subprocess
from PIL import Image
from pathlib import Path

# 설정
SRC_DIR = 'src/assets'
MAX_SIZE = 1920  # pixels - 모바일과 웹에서 충분한 크기
QUALITY = 85  # JPEG 품질 (85는 파일 크기와 품질의 좋은 균형)
EXCLUDE_DIRS = {'audio', 'optimized'}  # 제외할 폴더
BACKUP_SUFFIX = '.original'

def get_file_size_mb(filepath):
    """파일 크기를 MB로 반환"""
    if not os.path.exists(filepath):
        return 0
    return os.path.getsize(filepath) / (1024 * 1024)

def convert_with_imagemagick(input_path, output_path):
    """ImageMagick을 사용해서 이미지를 JPEG로 변환"""
    try:
        subprocess.run([
            'magick', str(input_path),
            '-quality', '95',  # 높은 품질로 변환 (나중에 최적화할 것)
            str(output_path)
        ], check=True, capture_output=True, text=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"  변환 실패: {e.stderr}")
        return False
    except Exception as e:
        print(f"  변환 실패: {e}")
        return False

def optimize_image(file_path):
    """이미지를 최적화하고 원본을 백업"""
    try:
        original_size = get_file_size_mb(file_path)
        file_ext = file_path.suffix.lower()
        converted_from_special = False
        
        # HEIC, CR3, heic 파일인 경우 먼저 JPEG로 변환
        if file_ext in ['.heic', '.cr3']:
            temp_jpg = file_path.with_suffix('.temp.jpg')
            
            print(f"  {file_ext.upper()} -> JPEG 변환 중...")
            if not convert_with_imagemagick(file_path, temp_jpg):
                raise Exception(f"{file_ext.upper()} 변환 실패")
            
            # 변환이 성공했는지 확인
            if not temp_jpg.exists() or get_file_size_mb(temp_jpg) == 0:
                raise Exception(f"{file_ext.upper()} 변환 결과 파일이 없습니다")
            
            # 백업 생성
            backup_path = str(file_path) + BACKUP_SUFFIX
            if not os.path.exists(backup_path):
                shutil.copy2(file_path, backup_path)
            
            # 원본 삭제
            os.remove(file_path)
            
            # 임시 파일을 원본 파일 경로로 사용
            file_path = temp_jpg
            converted_from_special = True
        
        # 이미지 열기
        with Image.open(file_path) as img:
            # EXIF 방향 정보 적용
            try:
                if hasattr(img, 'getexif'):
                    exif = img.getexif()
                    if exif:
                        orientation = exif.get(274)  # 274는 Orientation 태그
                        if orientation == 3:
                            img = img.rotate(180, expand=True)
                        elif orientation == 6:
                            img = img.rotate(270, expand=True)
                        elif orientation == 8:
                            img = img.rotate(90, expand=True)
            except:
                pass  # EXIF 없으면 무시
            
            # 원본 크기
            w, h = img.size
            
            # 리사이즈가 필요한 경우
            if max(w, h) > MAX_SIZE:
                scale = MAX_SIZE / max(w, h)
                new_size = (int(w * scale), int(h * scale))
                img = img.resize(new_size, Image.Resampling.LANCZOS)
                resized = True
            else:
                resized = False
            
            # RGB로 변환 (JPEG는 RGB만 지원)
            if img.mode in ('RGBA', 'LA', 'P'):
                # 투명도가 있는 경우 흰 배경 추가
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # 백업 파일명 생성 (아직 백업 안된 경우만, 그리고 특수 포맷이 아닌 경우)
            if not converted_from_special:
                backup_path = str(file_path) + BACKUP_SUFFIX
                if not os.path.exists(backup_path):
                    shutil.copy2(file_path, backup_path)
            
            # 최적화된 이미지를 JPEG로 저장
            output_path = file_path.with_suffix('.jpg')
            
            # temp 파일인 경우 원래 이름으로
            if '.temp' in str(output_path):
                output_path = Path(str(output_path).replace('.temp', ''))
            
            img.save(output_path, 'JPEG', quality=QUALITY, optimize=True)
            
            # 원본 파일 삭제 (확장자가 다른 경우 또는 temp 파일)
            if file_path != output_path and file_path.exists():
                os.remove(file_path)
            
            new_size_mb = get_file_size_mb(output_path)
            reduction = ((original_size - new_size_mb) / original_size * 100) if original_size > 0 else 0
            
            # 파일명 (확장자 제외)
            display_name = output_path.stem
            
            size_info = f"{original_size:.2f}MB -> {new_size_mb:.2f}MB ({reduction:.1f}% 감소)"
            if resized:
                print(f"✓ {display_name}: {w}x{h} -> {img.size[0]}x{img.size[1]}, {size_info}")
            else:
                print(f"✓ {display_name}: {w}x{h} (크기 유지), {size_info}")
            
            return True, original_size, new_size_mb
            
    except Exception as e:
        print(f"✗ {file_path.name} 처리 실패: {e}")
        # temp 파일 정리
        if 'temp_jpg' in locals() and Path(temp_jpg).exists():
            try:
                os.remove(temp_jpg)
            except:
                pass
        return False, 0, 0

def process_directory(directory):
    """디렉토리를 재귀적으로 처리"""
    total_processed = 0
    total_failed = 0
    total_original_size = 0
    total_new_size = 0
    
    for root, dirs, files in os.walk(directory):
        # 제외할 디렉토리는 건너뛰기
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        
        rel_path = os.path.relpath(root, directory)
        if rel_path != '.':
            print(f"\n📁 {rel_path} 폴더 처리 중...")
        
        for filename in files:
            file_path = Path(root) / filename
            
            # 백업 파일은 건너뛰기
            if filename.endswith(BACKUP_SUFFIX):
                continue
            
            # 이미지 파일인지 확인
            if file_path.suffix.lower() in {'.jpg', '.jpeg', '.png', '.heic', '.cr3'}:
                success, original_size, new_size = optimize_image(file_path)
                if success:
                    total_original_size += original_size
                    total_new_size += new_size
                    total_processed += 1
                else:
                    total_failed += 1

    return total_processed, total_failed, total_original_size, total_new_size

if __name__ == "__main__":
    print("=" * 70)
    print("🖼️  이미지 최적화 시작")
    print("=" * 70)
    print(f"최대 크기: {MAX_SIZE}px")
    print(f"JPEG 품질: {QUALITY}")
    print(f"대상 폴더: {SRC_DIR}")
    print(f"지원 포맷: JPG, JPEG, PNG, HEIC, CR3")
    print("=" * 70)
    
    processed, failed, original_size, new_size = process_directory(SRC_DIR)
    
    print("\n" + "=" * 70)
    print("✅ 완료!")
    print("=" * 70)
    print(f"처리된 이미지: {processed}개")
    print(f"실패한 이미지: {failed}개")
    print(f"총 용량 감소: {original_size:.2f}MB -> {new_size:.2f}MB")
    if original_size > 0:
        reduction = ((original_size - new_size) / original_size * 100)
        saved = original_size - new_size
        print(f"절약된 용량: {saved:.2f}MB ({reduction:.1f}%)")
    print("=" * 70)
    print("\n💡 팁: 원본 파일은 '.original' 확장자로 백업되었습니다.")
    print("   문제가 없다면 나중에 백업 파일을 삭제할 수 있습니다.")
