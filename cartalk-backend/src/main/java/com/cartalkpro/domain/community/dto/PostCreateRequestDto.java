package com.cartalkpro.domain.community.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostCreateRequestDto {
    private String category;
    private String title;
    private String content;
}