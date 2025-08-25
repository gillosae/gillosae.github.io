import weddingAudio from './assets/audio/wedding.mp3';

export const WEDDING_CONFIG = {
  // 신랑 신부 정보
  groom: {
    name: '이윤철',
    phone: '010-4424-2495',
    father: {
      name: '이창석',
      account: {
        bank: '하나은행',
        number: '244-910287-59007'
      }
    },
    mother: {
      name: '유덕희',
      account: {
        bank: '하나은행', 
        number: '105-12-257128'
      }
    },
    account: {
      bank: '하나은행',
      number: '620-251545-430'
    }
  },
  bride: {
    name: '이다영',
    phone: '010-5755-6922',
    father: {
      name: '이태광',
      account: {
        bank: '우리은행',
        number: '479-230-98202003'
      }
    },
    mother: {
      name: '송은영',
      account: {
        bank: '우리은행',
        number: '302-8944-1924-51'
      }
    },
    account: {
      bank: '우리은행',
      number: '1002-188-006922'
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
