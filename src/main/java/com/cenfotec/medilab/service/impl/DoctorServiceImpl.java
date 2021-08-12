package com.cenfotec.medilab.service.impl;

import com.cenfotec.medilab.domain.Doctor;
import com.cenfotec.medilab.repository.DoctorRepository;
import com.cenfotec.medilab.service.DoctorService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Doctor}.
 */
@Service
@Transactional
public class DoctorServiceImpl implements DoctorService {

    private final Logger log = LoggerFactory.getLogger(DoctorServiceImpl.class);

    private final DoctorRepository doctorRepository;

    public DoctorServiceImpl(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @Override
    public Doctor save(Doctor doctor) {
        log.debug("Request to save Doctor : {}", doctor);
        return doctorRepository.save(doctor);
    }

    @Override
    public Optional<Doctor> partialUpdate(Doctor doctor) {
        log.debug("Request to partially update Doctor : {}", doctor);

        return doctorRepository
            .findById(doctor.getId())
            .map(
                existingDoctor -> {
                    if (doctor.getSpecialty() != null) {
                        existingDoctor.setSpecialty(doctor.getSpecialty());
                    }

                    return existingDoctor;
                }
            )
            .map(doctorRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Doctor> findAll() {
        log.debug("Request to get all Doctors");
        return doctorRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Doctor> findOne(Long id) {
        log.debug("Request to get Doctor : {}", id);
        return doctorRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Doctor findByInternalUser(Long id) {
        return doctorRepository.findByInternalUser(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Doctor : {}", id);
        doctorRepository.deleteById(id);
    }
}
