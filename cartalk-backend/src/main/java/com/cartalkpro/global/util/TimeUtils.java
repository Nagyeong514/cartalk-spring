package com.cartalkpro.global.util;

import java.time.Duration;
import java.time.LocalDateTime;

public class TimeUtils {
    public static String formatRelativeTime(LocalDateTime time) {
        if (time == null) return "";

        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(time, now);
        long seconds = duration.getSeconds();


        if (seconds < 60) return "방금 전"; // 1분 미만
        if (seconds < 3600) return (seconds / 60) + "분 전"; // 1시간 미만

        // ✅ 24시간(86400초) 미만일 때만 "n시간 전"으로 표시
        if (seconds < 86400) return (seconds / 3600) + "시간 전";

        // ✅ 24시간이 지났다면? "2026-03-13" 같은 날짜 형식으로 반환
        return time.toLocalDate().toString();

//        if (seconds < 60) return "방금 전";
//        if (seconds < 3600) return (seconds / 60) + "분 전";
//        if (seconds < 86400) return (seconds / 3600) + "시간 전";
//        if (seconds < 2592000) return (seconds / 86400) + "일 전";
//        return time.toLocalDate().toString(); // 한 달이 넘으면 날짜로 표시
    }
}