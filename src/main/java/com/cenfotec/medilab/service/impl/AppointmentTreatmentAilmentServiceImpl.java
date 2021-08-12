package com.cenfotec.medilab.service.impl;

import com.cenfotec.medilab.domain.AppointmentTreatmentAilment;
import com.cenfotec.medilab.repository.AppointmentTreatmentAilmentRepository;
import com.cenfotec.medilab.service.AppointmentTreatmentAilmentService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link AppointmentTreatmentAilment}.
 */
@Service
@Transactional
public class AppointmentTreatmentAilmentServiceImpl implements AppointmentTreatmentAilmentService {

    private final Logger log = LoggerFactory.getLogger(AppointmentTreatmentAilmentServiceImpl.class);

    private final AppointmentTreatmentAilmentRepository appointmentTreatmentAilmentRepository;

    public AppointmentTreatmentAilmentServiceImpl(AppointmentTreatmentAilmentRepository appointmentTreatmentAilmentRepository) {
        this.appointmentTreatmentAilmentRepository = appointmentTreatmentAilmentRepository;
    }

    @Override
    public AppointmentTreatmentAilment save(AppointmentTreatmentAilment appointmentTreatmentAilment) {
        log.debug("Request to save AppointmentTreatmentAilment : {}", appointmentTreatmentAilment);
        return appointmentTreatmentAilmentRepository.save(appointmentTreatmentAilment);
    }

    @Override
    public Optional<AppointmentTreatmentAilment> partialUpdate(AppointmentTreatmentAilment appointmentTreatmentAilment) {
        log.debug("Request to partially update AppointmentTreatmentAilment : {}", appointmentTreatmentAilment);

        return appointmentTreatmentAilmentRepository
            .findById(appointmentTreatmentAilment.getId())
            .map(
                existingAppointmentTreatmentAilment -> {
                    if (appointmentTreatmentAilment.getDescription() != null) {
                        existingAppointmentTreatmentAilment.setDescription(appointmentTreatmentAilment.getDescription());
                    }
                    if (appointmentTreatmentAilment.getRemoved() != null) {
                        existingAppointmentTreatmentAilment.setRemoved(appointmentTreatmentAilment.getRemoved());
                    }

                    return existingAppointmentTreatmentAilment;
                }
            )
            .map(appointmentTreatmentAilmentRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentTreatmentAilment> findAll() {
        log.debug("Request to get all AppointmentTreatmentAilments");
        return appointmentTreatmentAilmentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentTreatmentAilment> findAllDiagnosisByPatient(Long id) {
        return appointmentTreatmentAilmentRepository.findAllDiagnosisByPatient(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AppointmentTreatmentAilment> findOne(Long id) {
        log.debug("Request to get AppointmentTreatmentAilment : {}", id);
        return appointmentTreatmentAilmentRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete AppointmentTreatmentAilment : {}", id);
        appointmentTreatmentAilmentRepository.deleteById(id);
    }
}
