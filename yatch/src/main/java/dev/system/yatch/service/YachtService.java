package dev.system.yatch.service;

import dev.system.yatch.dto.request.YachtRequest;
import dev.system.yatch.dto.response.YachtResponse;

import java.util.List;

public interface YachtService {
    List<YachtResponse> getAllYachts();

    YachtResponse getYachtById(String id);

    YachtResponse createYacht(YachtRequest request);

    YachtResponse updateYacht(String id, YachtRequest request);

    void deleteYacht(String id);
}
