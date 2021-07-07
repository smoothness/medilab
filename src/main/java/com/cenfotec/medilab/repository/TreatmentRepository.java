package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.Treatment;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Treatment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TreatmentRepository extends JpaRepository<Treatment, Long> {}
