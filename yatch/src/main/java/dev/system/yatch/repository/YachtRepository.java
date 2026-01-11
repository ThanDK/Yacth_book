package dev.system.yatch.repository;

import dev.system.yatch.entity.Yacht;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface YachtRepository extends MongoRepository<Yacht, String> {
    // Basic CRUD is provided by MongoRepository
}
