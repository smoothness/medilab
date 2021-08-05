package com.cenfotec.medilab.service.impl;

import com.cenfotec.medilab.domain.MedicalExams;
import com.cenfotec.medilab.repository.MedicalExamsRepository;
import com.cenfotec.medilab.service.MedicalExamsService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link MedicalExams}.
 */
@Service
@Transactional
public class MedicalExamsServiceImpl implements MedicalExamsService {

    private final Logger log = LoggerFactory.getLogger(MedicalExamsServiceImpl.class);

    private final MedicalExamsRepository medicalExamsRepository;

    public MedicalExamsServiceImpl(MedicalExamsRepository medicalExamsRepository) {
        this.medicalExamsRepository = medicalExamsRepository;
    }

    @Override
    public MedicalExams save(MedicalExams medicalExams) {
        log.debug("Request to save MedicalExams : {}", medicalExams);
        return medicalExamsRepository.save(medicalExams);
    }

    @Override
    public Optional<MedicalExams> partialUpdate(MedicalExams medicalExams) {
        log.debug("Request to partially update MedicalExams : {}", medicalExams);

        return medicalExamsRepository
            .findById(medicalExams.getId())
            .map(
                existingMedicalExams -> {
                    if (medicalExams.getName() != null) {
                        existingMedicalExams.setName(medicalExams.getName());
                    }
                    if (medicalExams.getDescription() != null) {
                        existingMedicalExams.setDescription(medicalExams.getDescription());
                    }
                    if (medicalExams.getRemoved() != null) {
                        existingMedicalExams.setRemoved(medicalExams.getRemoved());
                    }

                    return existingMedicalExams;
                }
            )
            .map(medicalExamsRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MedicalExams> findAll() {
        log.debug("Request to get all MedicalExams");
        return medicalExamsRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MedicalExams> findMedicalExamsByAppointment(Long id) {
        return medicalExamsRepository.findMedicalExamsByAppointment(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<MedicalExams> findOne(Long id) {
        log.debug("Request to get MedicalExams : {}", id);
        return medicalExamsRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete MedicalExams : {}", id);
        medicalExamsRepository.deleteById(id);
    }

    @Override
    public void deleteByRemoved(Long id) {
        medicalExamsRepository.deleteByRemoved(id);
    }
}
