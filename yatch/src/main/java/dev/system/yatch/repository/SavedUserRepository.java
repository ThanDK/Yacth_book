package dev.system.yatch.repository;

import dev.system.yatch.entity.SavedUser;
import dev.system.yatch.enums.UserType;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface SavedUserRepository extends MongoRepository<SavedUser, String> {
    Optional<SavedUser> findByUserId(String userId);

    List<SavedUser> findByIsActiveTrue();

    List<SavedUser> findByUserType(UserType userType);

    List<SavedUser> findByUserTypeAndIsActiveTrue(UserType userType);
}
