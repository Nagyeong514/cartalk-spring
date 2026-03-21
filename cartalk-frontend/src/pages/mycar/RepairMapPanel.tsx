import { useEffect, useRef, useState } from "react";
import { Phone, Navigation, MapPin } from "lucide-react";

interface RepairShop {
  companyName: string;
  roadAddress: string;
  latitude: string;
  longitude: string;
  phoneNumber: string;
  distance?: number;
}

interface Props {
  carBrand: string;
}

export default function RepairMapPanel({ carBrand }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [shops, setShops] = useState<RepairShop[]>([]);
  const [map, setMap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 기존 마커들을 관리하기 위한 Ref
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    const initMap = () => {
      console.log("1. 지도 초기화 시도");
      if (!mapContainer.current) return console.log("에러: mapContainer 없음");
      if (!window.kakao) return console.log("에러: window.kakao 없음 (SDK 로드 실패)");

      const options = {
        center: new window.kakao.maps.LatLng(36.3504, 127.3845),
        level: 3,
      };
      const kakaoMap = new window.kakao.maps.Map(mapContainer.current, options);
      setMap(kakaoMap);
      console.log("2. 지도 생성 완료");

      if (navigator.geolocation) {
        console.log("3. GPS 권한 요청 중...");
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            console.log("4. GPS 좌표 획득 성공:", position.coords.latitude, position.coords.longitude);
            const { latitude, longitude } = position.coords;
            fetchNearbyShops(latitude, longitude, kakaoMap);
          },
          (error) => {
            console.log("에러: GPS 권한 거부됨", error);
            fetchNearbyShops(36.3504, 127.3845, kakaoMap); // 거부 시 대전 기본값으로 진행
          }
        );
      } else {
        console.log("에러: 브라우저가 GPS를 지원하지 않음");
      }
    };

    initMap();
  }, [carBrand]);

  const fetchNearbyShops = async (lat: number, lng: number, kakaoMap: any) => {
    try {
      console.log("1. 백엔드 호출 시작 - 브랜드:", carBrand, "위도:", lat, "경도:", lng);
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `http://localhost:8080/api/repair/nearby?brand=${carBrand}&lat=${lat}&lng=${lng}`,
        { headers: { "Authorization": `Bearer ${token}` } }
      );

      console.log("2. 백엔드 응답 상태:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("3. 받은 데이터 개수:", data.length);
        setShops(data);
        displayMarkers(data, kakaoMap);
      } else {
        console.error("4. 백엔드 에러 발생");
      }
    } catch (error) {
      console.error("5. 네트워크/통신 에러:", error);
    } finally {
      console.log("6. 로딩 종료");
      setLoading(false);
    }
  };

  const displayMarkers = (shopList: RepairShop[], kakaoMap: any) => {
    // 기존 마커 삭제 로직 추가
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const newMarkers = shopList.map((shop) => {
      const position = new window.kakao.maps.LatLng(shop.latitude, shop.longitude);
      const marker = new window.kakao.maps.Marker({
        position: position,
        map: kakaoMap,
        title: shop.companyName,
      });
      return marker;
    });

    markersRef.current = newMarkers;
  };

  return (
    <div className="grid h-[600px] w-full grid-cols-1 overflow-hidden rounded-2xl border-2 border-border bg-card lg:grid-cols-[1.5fr_1fr]">
      <div ref={mapContainer} className="relative h-full w-full bg-zinc-800">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/40 backdrop-blur-sm">
            <p className="text-xs font-black uppercase tracking-widest animate-pulse">Scanning Nearby Centers...</p>
          </div>
        )}
      </div>

      <div className="flex flex-col border-l border-border bg-card">
        <div className="border-b border-border p-5">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={16} className="text-primary" />
            <h3 className="text-lg font-bold text-foreground">{carBrand} Centers</h3>
          </div>
          <p className="text-xs text-muted-foreground font-medium">가장 가까운 공식 센터 리스트입니다.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {shops.length > 0 ? (
            shops.map((shop) => (
              <div key={shop.companyName} className="group rounded-xl border border-border bg-zinc-900/30 p-4 transition-all hover:border-primary/40">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{shop.companyName}</h4>
                  <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded">{shop.distance} km</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">{shop.roadAddress}</p>
                <div className="flex gap-2">
                  <a href={`tel:${shop.phoneNumber}`} className="flex-1 flex items-center justify-center gap-2 py-2 bg-zinc-800 rounded-lg text-[11px] font-bold hover:bg-zinc-700">
                    <Phone size={12} /> Call
                  </a>
                  <button
                    onClick={() => map.panTo(new window.kakao.maps.LatLng(shop.latitude, shop.longitude))}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground rounded-lg text-[11px] font-bold"
                  >
                    <Navigation size={12} /> Focus
                  </button>
                </div>
              </div>
            ))
          ) : (
            !loading && <div className="py-20 text-center text-xs text-muted-foreground font-bold">검색 결과가 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}