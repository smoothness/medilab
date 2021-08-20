package com.cenfotec.medilab.repository;

import com.cenfotec.medilab.domain.Appointment;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Appointment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    @Query(
        value = "SELECT *  from appointment" +
            " INNER JOIN patient ON patient.id  = appointment.patient_id where doctor_id = :id" +
            " AND appointment.status = 'PENDING'" +
            " order by date asc",
        nativeQuery = true
    )
    List<Appointment> findByDoctorAppointments(@Param("id") Long id);

    @Query(
        value = "SELECT *  from appointment" +
            " INNER JOIN doctor ON doctor.id  = appointment.doctor_id" +
            " where patient_id = :id AND appointment.status = 'PENDING'" +
            " order by date asc",
        nativeQuery = true
    )
    List<Appointment> findByPatientAppointments(@Param("id") Long id);


    @Query(value = "SELECT *  from appointment" +
        " INNER JOIN patient ON patient.id  = appointment.patient_id" +
        " where patient.id = :id AND appointment.status <> 'PENDING'" +
        " order by date asc", nativeQuery = true)
    List<Appointment> findAppointmentHistoryPatient(@Param("id") Long id);


    @Query(value = "SELECT *  from appointment" +
        " INNER JOIN doctor ON doctor.id  = appointment.doctor_id" +
        " where doctor.id = :id AND appointment.status <> 'PENDING'" +
        " order by date asc", nativeQuery = true)
    List<Appointment> findAppointmentHistoryDoctor(@Param("id") Long id);


    @Query(value = "SELECT *  from appointment WHERE  status <> 'PENDING' order by date asc", nativeQuery = true)
    List<Appointment> findAppointmentsHistory();
}
