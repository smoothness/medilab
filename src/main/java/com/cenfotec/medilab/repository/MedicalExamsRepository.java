package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.MedicalExams;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the MedicalExams entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MedicalExamsRepository extends JpaRepository<MedicalExams, Long> {}
