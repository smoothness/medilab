package com.cenfotec.medilab.service;

import com.cenfotec.medilab.domain.Appointment;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Appointment}.
 */
public interface AppointmentService {
    /**
     * Save a appointment.
     *
     * @param appointment the entity to save.
     * @return the persisted entity.
     */
    Appointment save(Appointment appointment);

    /**
     * Partially updates a appointment.
     *
     * @param appointment the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Appointment> partialUpdate(Appointment appointment);

    /**
     * Get all the appointments.
     *
     * @return the list of entities.
     */
    List<Appointment> findAll();

    /**
     * Get the "id" appointment.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Appointment> findOne(Long id);

    /**
     * Get the list of appointments.
     *
     * @param id the id of the doctor.
     * @return the list appointments.
     */
    List<Appointment> findDoctorAppointments(Long id);

    /**
     * Get the list of appointments.
     *
     * @param id the id of the doctor.
     * @return the list appointments.
     */
    List<Appointment> findPatientAppointments(Long id);


    List<Appointment> findAppointmentHistoryPatient(Long id);
    List<Appointment> findAppointmentHistoryDoctor(Long id);
    List<Appointment> findAppointmentsHistory();

    /**
     * Delete the "id" appointment.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
