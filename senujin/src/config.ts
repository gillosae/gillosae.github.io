import weddingAudio from './assets/audio/wedding.mp3';

export const WEDDING_CONFIG = {
  // 신랑 신부 정보
  groom: {
    name: '김선우',
    phone: '010-3456-7890',
    father: {
      name: '김석민',
      account: {
        bank: '행복은행',
        number: '123-45-67890-1'
      }
    },
    mother: {
      name: '유혜진',
      account: {
        bank: '행복은행', 
        number: '123-45-67890-1'
      }
    },
    account: {
      bank: '행복은행',
      number: '123-45-67890-1'
    }
  },
  bride: {
    name: '이유진',
    phone: '010-3456-7890',
    father: {
      name: '이광재',
      account: {
        bank: '행복은행',
        number: '123-45-67890-1'
      }
    },
    mother: {
      name: '이지영',
      account: {
        bank: '행복은행',
        number: '123-45-67890-1'
      }
    },
    account: {
      bank: '행복은행',
      number: '123-45-67890-1'
    }
  },
  // 웨딩 날짜 및 시간
  wedding: {
    date: '2025-12-20',
    time: '13:00:00',
    timezone: '+09:00',
    displayDate: '2025년 12월 20일 토요일 오후 1시',
    shortDate: '2025 / 12 / 20',
    dayOfWeek: '토요일'
  },
  // 웨딩 장소
  venue: {
    name: '차바이오 컴플렉스',
    hall: '지하 1층 국제회의실',
    floor: '7F',
    fullName: '차바이오 컴플렉스 지하 1층 국제회의실',
    address: '경기 성남시 분당구 판교로 335',
    coordinates: {
      lat: 37.403848,
      lng: 127.111674,
    },
    kakaoMapUrl: 'https://place.map.kakao.com/25769916',
    naverMapUrl: 'https://naver.me/xExWFUjt'
  },
  // 오디오 설정
  audio: {
    enabled: true, // 음악 기능 활성화 여부
    autoPlay: false, // 페이지 로드 시 자동 재생 여부
    src: weddingAudio, // 음악 파일 경로
    volume: 0.5 // 볼륨 (0.0 ~ 1.0)
  }
};
