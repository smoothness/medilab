package com.cenfotec.medilab.service.impl;

import com.cenfotec.medilab.domain.Ailment;
import com.cenfotec.medilab.repository.AilmentRepository;
import com.cenfotec.medilab.service.AilmentService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Ailment}.
 */
@Service
@Transactional
public class AilmentServiceImpl implements AilmentService {

    private final Logger log = LoggerFactory.getLogger(AilmentServiceImpl.class);

    private final AilmentRepository ailmentRepository;

    public AilmentServiceImpl(AilmentRepository ailmentRepository) {
        this.ailmentRepository = ailmentRepository;
    }

    @Override
    public Ailment save(Ailment ailment) {
        log.debug("Request to save Ailment : {}", ailment);
        return ailmentRepository.save(ailment);
    }

    @Override
    public Optional<Ailment> partialUpdate(Ailment ailment) {
        log.debug("Request to partially update Ailment : {}", ailment);

        return ailmentRepository
            .findById(ailment.getId())
            .map(
                existingAilment -> {
                    if (ailment.getName() != null) {
                        existingAilment.setName(ailment.getName());
                    }
                    if (ailment.getRemoved() != null) {
                        existingAilment.setRemoved(ailment.getRemoved());
                    }

                    return existingAilment;
                }
            )
            .map(ailmentRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Ailment> findAll() {
        log.debug("Request to get all Ailments");
        return ailmentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Ailment> findOne(Long id) {
        log.debug("Request to get Ailment : {}", id);
        return ailmentRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Ailment> findAllPatientAilments(Long id) {
        return ailmentRepository.findAllPatientAilments(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Ailment : {}", id);
        ailmentRepository.deleteById(id);
    }
}
