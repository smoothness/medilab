package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.Patient;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.swing.*;
import java.util.Optional;

/**
 * Spring Data SQL repository for the Patient entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    @Query(value = "SELECT * from patient where internal_user_id = :id", nativeQuery = true)
    Patient findByInternalUser(@Param("id") Long id);

    @Query(value = "SELECT patient.id, patient.second_surname, patient.phone, patient.internal_user_id, patient.token, patient.active FROM patient " +
        " inner join appointment on" +
        " appointment.patient_id = patient.id" +
        " Inner join invoice on invoice.appointment_id = appointment.id" +
        " where appointment.id = :id", nativeQuery = true)
    Patient findPatientByAppointment(@Param("id") Long id);
}
