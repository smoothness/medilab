package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.Appointment;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data SQL repository for the Appointment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Query(value = "SELECT *  from appointment " +
        "INNER JOIN patient ON patient.id  = appointment.patient_id where doctor_id = :id", nativeQuery = true)
    List<Appointment> findByDoctorAppointments(@Param("id") Long id);
}
