import weddingAudio from './assets/audio/wedding.mp3';

export const WEDDING_CONFIG = {
  // 신랑 신부 정보
  groom: {
    name: '이윤철',
    phone: '010-1234-5678',
    father: {
      name: '이창석',
      account: {
        bank: '은행',
        number: '1234-567-890000'
      }
    },
    mother: {
      name: '유덕희',
      account: {
        bank: '은행', 
        number: '1234-567-890000'
      }
    },
    account: {
      bank: '은행',
      number: '1234-567-890000'
    }
  },
  bride: {
    name: '이다영',
    phone: '010-1234-5678',
    father: {
      name: '이태광',
      account: {
        bank: '은행',
        number: ''
      }
    },
    mother: {
      name: '송은영',
      account: {
        bank: '은행',
        number: '1234-567-890000'
      }
    },
    account: {
      bank: '은행',
      number: '1234-567-890000'
    }
  },
  // 웨딩 날짜 및 시간
  wedding: {
    date: '2025-10-12',
    time: '12:30:00',
    timezone: '+09:00',
    displayDate: '2025년 10월 12일 일요일 오후 12시 30분',
    shortDate: '2025 / 10 / 12',
    dayOfWeek: '일요일'
  },
  // 웨딩 장소
  venue: {
    name: '아펠가모 잠실',
    hall: '단독홀',
    floor: '2F',
    fullName: '아펠가모 잠실 단독홀',
    address: '서울 송파구 올림픽로35길 137 한국광고문화회관 2층',
    coordinates: {
      lat: 37.5161749,
      lng: 127.0994500,
    },
    kakaoMapUrl: 'https://place.map.kakao.com/21401219',
    naverMapUrl: 'https://naver.me/FzSZfBX6'
  },
  // 오디오 설정
  audio: {
    enabled: true, // 음악 기능 활성화 여부
    autoPlay: false, // 페이지 로드 시 자동 재생 여부
    src: weddingAudio, // 음악 파일 경로
    volume: 0.5 // 볼륨 (0.0 ~ 1.0)
  }
};
