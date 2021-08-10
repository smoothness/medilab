package com.cenfotec.medilab.service;

import com.cenfotec.medilab.domain.Patient;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Patient}.
 */
public interface PatientService {
    /**
     * Save a patient.
     *
     * @param patient the entity to save.
     * @return the persisted entity.
     */
    Patient save(Patient patient);

    /**
     * Partially updates a patient.
     *
     * @param patient the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Patient> partialUpdate(Patient patient);

    /**
     * Get all the patients.
     *
     * @return the list of entities.
     */
    List<Patient> findAll();

    /**
     * Get the "id" patient.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Patient> findOne(Long id);

    Patient findByInternalUser(Long id);

    Patient findPatientByAppointment( Long id);

    Optional<Patient> findPatientByToken(String token);

    /**
     * Delete the "id" patient.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
