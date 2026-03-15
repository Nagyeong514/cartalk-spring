package com.cartalkpro.global.util;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileService {

    // ✅ 파일이 저장될 경로
    private final String uploadPath = "C:/cartalk_uploads/";

    /**
     * 파일을 서버 폴더에 저장합니다.
     */
    public String storeFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) return null;

        String originalFilename = file.getOriginalFilename();
        String storeFilename = UUID.randomUUID().toString() + "_" + originalFilename;

        File folder = new File(uploadPath);
        if (!folder.exists()) folder.mkdirs();

        file.transferTo(new File(uploadPath + storeFilename));

        return storeFilename;
    }

    /**
     * 서버 폴더에 저장된 물리 파일을 삭제합니다.
     */
    public void deleteFile(String storeFilename) {
        // 1. 파일이 저장된 실제 전체 경로를 생성합니다.
        String fullPath = uploadPath + storeFilename;

        // 2. 해당 경로를 가리키는 파일 객체를 만듭니다.
        File file = new File(fullPath);

        // 3. 파일이 실제로 존재하면 삭제를 수행합니다.
        if (file.exists()) {
            boolean result = file.delete();
            if (result) {
                System.out.println("파일 삭제 성공: " + storeFilename);
            } else {
                System.out.println("파일 삭제 실패: " + storeFilename);
            }
        } else {
            System.out.println("삭제할 파일이 존재하지 않습니다: " + storeFilename);
        }
    }
}