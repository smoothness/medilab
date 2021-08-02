package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.AppointmentTreatmentAilment;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the AppointmentTreatmentAilment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AppointmentTreatmentAilmentRepository extends JpaRepository<AppointmentTreatmentAilment, Long> {

   
}
