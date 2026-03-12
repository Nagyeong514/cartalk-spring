package com.cartalkpro.global.util;

import java.time.Duration;
import java.time.LocalDateTime;

public class TimeUtils {
    public static String formatRelativeTime(LocalDateTime time) {
        if (time == null) return "";

        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(time, now);
        long seconds = duration.getSeconds();

        if (seconds < 60) return "방금 전";
        if (seconds < 3600) return (seconds / 60) + "분 전";
        if (seconds < 86400) return (seconds / 3600) + "시간 전";
        if (seconds < 2592000) return (seconds / 86400) + "일 전";

        return time.toLocalDate().toString(); // 한 달이 넘으면 날짜로 표시
    }
}