package com.cenfotec.medilab.service.impl;

import com.cenfotec.medilab.domain.Appointment;
import com.cenfotec.medilab.repository.AppointmentRepository;
import com.cenfotec.medilab.service.AppointmentService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Appointment}.
 */
@Service
@Transactional
public class AppointmentServiceImpl implements AppointmentService {

    private final Logger log = LoggerFactory.getLogger(AppointmentServiceImpl.class);

    private final AppointmentRepository appointmentRepository;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public Appointment save(Appointment appointment) {
        log.debug("Request to save Appointment : {}", appointment);
        return appointmentRepository.save(appointment);
    }

    @Override
    public Optional<Appointment> partialUpdate(Appointment appointment) {
        log.debug("Request to partially update Appointment : {}", appointment);

        return appointmentRepository
            .findById(appointment.getId())
            .map(
                existingAppointment -> {
                    if (appointment.getDate() != null) {
                        existingAppointment.setDate(appointment.getDate());
                    }
                    if (appointment.getStatus() != null) {
                        existingAppointment.setStatus(appointment.getStatus());
                    }

                    return existingAppointment;
                }
            )
            .map(appointmentRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Appointment> findAll() {
        log.debug("Request to get all Appointments");
        return appointmentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Appointment> findOne(Long id) {
        log.debug("Request to get Appointment : {}", id);
        return appointmentRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Appointment> findDoctorAppointments(Long id) {
        log.debug("Request to get Appointment : {}", id);
        return appointmentRepository.findByDoctorAppointments(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Appointment : {}", id);
        appointmentRepository.deleteById(id);
    }
}
