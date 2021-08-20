package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.RatingUser;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the RatingUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RatingUserRepository extends JpaRepository<RatingUser, Long> {
    @Query(value = "SELECT AVG(rating.value)" +
        " FROM rating_user" +
        " INNER JOIN rating" +
        " ON rating.id = rating_user.rating_id" +
        " INNER JOIN appointment ON" +
        " appointment.doctor_id = rating_user.doctor_id" +
        " WHERE rating_user.doctor_id = :doctorId" +
        " GROUP BY rating_user.doctor_id",
        nativeQuery = true)
    Object findAverageByDoctor(@Param("doctorId") Long doctorId);
}
