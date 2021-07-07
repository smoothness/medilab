package com.cenfotec.medilab.service;

import com.cenfotec.medilab.domain.AppointmentTreatmentAilment;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link AppointmentTreatmentAilment}.
 */
public interface AppointmentTreatmentAilmentService {
    /**
     * Save a appointmentTreatmentAilment.
     *
     * @param appointmentTreatmentAilment the entity to save.
     * @return the persisted entity.
     */
    AppointmentTreatmentAilment save(AppointmentTreatmentAilment appointmentTreatmentAilment);

    /**
     * Partially updates a appointmentTreatmentAilment.
     *
     * @param appointmentTreatmentAilment the entity to update partially.
     * @return the persisted entity.
     */
    Optional<AppointmentTreatmentAilment> partialUpdate(AppointmentTreatmentAilment appointmentTreatmentAilment);

    /**
     * Get all the appointmentTreatmentAilments.
     *
     * @return the list of entities.
     */
    List<AppointmentTreatmentAilment> findAll();

    /**
     * Get the "id" appointmentTreatmentAilment.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<AppointmentTreatmentAilment> findOne(Long id);

    /**
     * Delete the "id" appointmentTreatmentAilment.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
