package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.RatingUser;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the RatingUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RatingUserRepository extends JpaRepository<RatingUser, Long> {}
