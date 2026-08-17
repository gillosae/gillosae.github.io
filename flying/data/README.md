# my-flights.json 편집 가이드

## flights (탑승 기록)

```json
{
  "airline": "KE",            // 항공사 IATA 코드 (airlines.json의 iata 값)
  "date": "2024-03-01",       // YYYY-MM-DD
  "from": "ICN",              // 출발 공항 IATA 코드
  "to": "NRT",                // 도착 공항 IATA 코드
  "flightNumber": "KE001",    // 편명 (선택)
  "aircraft": "B77W",         // aircraft.json의 code 값 (선택)
  "cabinClass": "economy",    // economy | premium_economy | business | first (선택)
  "notes": ""                 // 메모 (선택)
}
```

같은 항공사를 여러 번 탔으면 flights 배열에 항목을 여러 개 추가하면 됩니다. 항공사 카드를 클릭하면 이 기록들이 최신순으로 모여서 보여요.

## hiddenAirlines (목록에서 숨기기)

이미 없어졌거나 관심 없는 항공사를 체크리스트에서 숨기고 싶으면 IATA 코드를 추가하세요.

```json
"hiddenAirlines": ["XX", "YY"]
```

## customAirlines (목록에 없는 항공사 추가)

airlines.json에 없는 항공사를 탔다면 여기에 추가한 뒤 flights에서 참조하세요.

```json
{
  "id": "custom-my-airline",
  "name": "My Airline",
  "iata": "",
  "country": "Country Name",
  "flag": "🏳️"
}
```
