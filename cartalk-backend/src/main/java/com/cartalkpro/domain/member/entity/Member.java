
package com.cartalkpro.domain.member.entity;

import com.cartalkpro.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity // DB의 테이블과 일치하는 자바 클래스임을 선언
@Table(name = "members") // DB의 'members' 테이블과 연결함
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 무분별한 객체 생성을 막아 데이터 안전성 확보
public class Member extends BaseTimeEntity {    // BaseTimeEntity를 상속받아 생성/수정시간 자동 포함

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // DB가 ID값을 알아서 1씩 증가시키며 부여함
    private Long id;

    @Column(nullable = false, unique = true)    // 필수값이며 중복될 수 없음
    private String email;

    @Column(nullable = false)   // 필수값
    private String password;

    private String name;

    @Column(length = 20)
    private String role; // 초기엔 String으로 하고 나중에 Enum으로 바꿔도 됩니다!

    @Builder    // 객체 생성 시 어떤 필드에 어떤 값을 넣는지 명확하게 해주는 도구
    public Member(String email, String password, String name, String role) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.role = (role == null) ? "USER" : role;     // 권한이 없으면 기본 'USER' 부여
    }
}