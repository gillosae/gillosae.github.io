import weddingAudio from './assets/audio/wedding.mp3';

export const WEDDING_CONFIG = {
  // 신랑 신부 정보
  groom: {
    name: '김선우',
    phone: '010-2955-5786',
    father: {
      name: '김석민',
      account: {
        bank: '부산은행',
        number: '077-12-082485-1'
      }
    },
    mother: {
      name: '유혜진',
      account: {
        bank: '부산은행', 
        number: '247-12-032468-3'
      }
    },
    account: {
      bank: '카카오뱅크',
      number: '3333-3176-17707'
    }
  },
  bride: {
    name: '이유진',
    phone: '010-2089-1151',
    father: {
      name: '이광재',
      account: {
        bank: '농협은행',
        number: '356-0774-2353-43'
      }
    },
    mother: {
      name: '이지영',
      account: {
        bank: '농협은행',
        number: '356-0697-1763-33'
      }
    },
    account: {
      bank: '카카오뱅크',
      number: '3333-0749-77837'
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
