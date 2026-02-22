package com.cartalkpro.domain.vehicle.entity;
// 차량 정보 설계도

import com.cartalkpro.domain.member.entity.Member;
import com.cartalkpro.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity     // [DB 연결] 이 클래스를 데이터베이스의 테이블과 매핑함
@Table(name = "vehicle") // SQL 테이블명과 맞춤
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)      // [안전성] 무분별한 객체 생성을 막아 데이터 왜곡 방지
@AllArgsConstructor
@Builder    // [객체 생성] 가독성 좋게 차량 데이터를 생성하도록 도와줌
public class Vehicle extends BaseTimeEntity {       // [날짜 상속] 생성/수정 시간을 자동으로 관리함

    @Id // [기본키] 테이블의 고유 번호(PK)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // [자동 증가] DB가 ID를 1, 2, 3... 순서대로 부여함
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // 지연 로딩     // [연관 관계] 여러 대의 차량은 한 명의 회원에게 속함 (N:1)
    @JoinColumn(name = "members_id") // SQL의 FK 컬럼명과 맞춤     // [외래키] DB 테이블의 members_id 컬럼과 연결됨
    private Member member;

    @Column(nullable = false)   // [필수] 모델명은 비어있을 수 없음
    private String modelName;

    @Column(nullable = false)   // [필수] 연식은 필수 정보
    private int modelYear;

    @Column(nullable = false, unique = true, length = 17) // 차대번호 17자리 고정
    private String vin;

    private int mileage;    // 주행 거리
}