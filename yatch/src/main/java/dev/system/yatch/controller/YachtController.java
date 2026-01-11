package dev.system.yatch.controller;

import dev.system.yatch.dto.request.YachtRequest;
import dev.system.yatch.dto.response.YachtResponse;
import dev.system.yatch.service.YachtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/yachts")
@RequiredArgsConstructor
public class YachtController {

    private final YachtService yachtService;

    @GetMapping
    public List<YachtResponse> getAllYachts() {
        return yachtService.getAllYachts();
    }

    @GetMapping("/{id}")
    public YachtResponse getYachtById(@PathVariable String id) {
        return yachtService.getYachtById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public YachtResponse createYacht(@RequestBody YachtRequest request) {
        return yachtService.createYacht(request);
    }

    @PatchMapping("/{id}")
    public YachtResponse updateYacht(@PathVariable String id, @RequestBody YachtRequest request) {
        return yachtService.updateYacht(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteYacht(@PathVariable String id) {
        yachtService.deleteYacht(id);
    }
}
