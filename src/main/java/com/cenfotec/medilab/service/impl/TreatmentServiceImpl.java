package com.cenfotec.medilab.service.impl;

import com.cenfotec.medilab.domain.Treatment;
import com.cenfotec.medilab.repository.TreatmentRepository;
import com.cenfotec.medilab.service.TreatmentService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Treatment}.
 */
@Service
@Transactional
public class TreatmentServiceImpl implements TreatmentService {

    private final Logger log = LoggerFactory.getLogger(TreatmentServiceImpl.class);

    private final TreatmentRepository treatmentRepository;

    public TreatmentServiceImpl(TreatmentRepository treatmentRepository) {
        this.treatmentRepository = treatmentRepository;
    }

    @Override
    public Treatment save(Treatment treatment) {
        log.debug("Request to save Treatment : {}", treatment);
        return treatmentRepository.save(treatment);
    }

    @Override
    public Optional<Treatment> partialUpdate(Treatment treatment) {
        log.debug("Request to partially update Treatment : {}", treatment);

        return treatmentRepository
            .findById(treatment.getId())
            .map(
                existingTreatment -> {
                    if (treatment.getSpecifications() != null) {
                        existingTreatment.setSpecifications(treatment.getSpecifications());
                    }
                    if (treatment.getMedicines() != null) {
                        existingTreatment.setMedicines(treatment.getMedicines());
                    }
                    if (treatment.getDuration() != null) {
                        existingTreatment.setDuration(treatment.getDuration());
                    }
                    if (treatment.getRemoved() != null) {
                        existingTreatment.setRemoved(treatment.getRemoved());
                    }

                    return existingTreatment;
                }
            )
            .map(treatmentRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Treatment> findAll() {
        log.debug("Request to get all Treatments");
        return treatmentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Treatment> findOne(Long id) {
        log.debug("Request to get Treatment : {}", id);
        return treatmentRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Treatment : {}", id);
        treatmentRepository.deleteById(id);
    }
}
