package com.cartalkpro.domain.member.repository;

import com.cartalkpro.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    // [이메일 중복 확인용] DB에서 해당 이메일이 있는지 찾아보는 기능
    Optional<Member> findByEmail(String email);
}