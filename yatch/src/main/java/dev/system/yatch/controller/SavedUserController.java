package dev.system.yatch.controller;

import dev.system.yatch.dto.request.SavedUserRequest;
import dev.system.yatch.dto.response.SavedUserResponse;
import dev.system.yatch.enums.UserType;
import dev.system.yatch.service.SavedUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved-users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SavedUserController {

    private final SavedUserService savedUserService;

    @GetMapping
    public ResponseEntity<List<SavedUserResponse>> getAll(
            @RequestParam(required = false) UserType type) {
        if (type != null) {
            return ResponseEntity.ok(savedUserService.getByType(type));
        }
        return ResponseEntity.ok(savedUserService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SavedUserResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(savedUserService.getById(id));
    }

    @PostMapping
    public ResponseEntity<SavedUserResponse> create(@RequestBody SavedUserRequest request) {
        return ResponseEntity.ok(savedUserService.create(request));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<SavedUserResponse> update(
            @PathVariable String id,
            @RequestBody SavedUserRequest request) {
        return ResponseEntity.ok(savedUserService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        savedUserService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
