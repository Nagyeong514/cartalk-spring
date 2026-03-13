package com.cartalkpro.global.util;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileService {

    // ✅ 파일이 저장될 경로 (프로젝트 외부에 저장하는 것이 좋습니다)
    private final String uploadPath = "C:/cartalk_uploads/";

    public String storeFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) return null;

        // 1. 저장될 파일명 생성 (중복 방지를 위해 UUID 사용)
        String originalFilename = file.getOriginalFilename();
        String storeFilename = UUID.randomUUID().toString() + "_" + originalFilename;

        // 2. 폴더가 없으면 생성
        File folder = new File(uploadPath);
        if (!folder.exists()) folder.mkdirs();

        // 3. 실제 파일 저장
        file.transferTo(new File(uploadPath + storeFilename));

        // 4. DB에 저장할 '경로' 또는 '파일명' 반환
        return storeFilename;
    }
}