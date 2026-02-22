package com.cartalkpro.global.common;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@MappedSuperclass   // 상속받는 자식 클래스들에게 이 필드(날짜)를 전달함
@EntityListeners(AuditingEntityListener.class)  // 데이터 변화를 감시해서 시간을 자동 입력함
//"모든 테이블에 공통으로 들어가는 '생성 시간', '수정 시간'을 한 곳에서 관리하는 부모 클래스입니다."
public abstract class BaseTimeEntity {

    @CreatedDate    // 데이터 생성 시점의 시간을 자동으로 저장
    @Column(updatable = false) // 생성일은 수정되지 않게 보호
    private LocalDateTime createdAt;

    @LastModifiedDate   // 데이터 수정 시점의 시간을 자동으로 업데이트
    private LocalDateTime modifiedAt;
}