package com.cenfotec.medilab.service.impl;

import com.cenfotec.medilab.domain.Binnacle;
import com.cenfotec.medilab.repository.BinnacleRepository;
import com.cenfotec.medilab.service.BinnacleService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Binnacle}.
 */
@Service
@Transactional
public class BinnacleServiceImpl implements BinnacleService {

    private final Logger log = LoggerFactory.getLogger(BinnacleServiceImpl.class);

    private final BinnacleRepository binnacleRepository;

    public BinnacleServiceImpl(BinnacleRepository binnacleRepository) {
        this.binnacleRepository = binnacleRepository;
    }

    @Override
    public Binnacle save(Binnacle binnacle) {
        log.debug("Request to save Binnacle : {}", binnacle);
        return binnacleRepository.save(binnacle);
    }

    @Override
    public Optional<Binnacle> partialUpdate(Binnacle binnacle) {
        log.debug("Request to partially update Binnacle : {}", binnacle);

        return binnacleRepository
            .findById(binnacle.getId())
            .map(
                existingBinnacle -> {
                    if (binnacle.getDoctorCode() != null) {
                        existingBinnacle.setDoctorCode(binnacle.getDoctorCode());
                    }
                    if (binnacle.getDate() != null) {
                        existingBinnacle.setDate(binnacle.getDate());
                    }

                    return existingBinnacle;
                }
            )
            .map(binnacleRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Binnacle> findAll() {
        log.debug("Request to get all Binnacles");
        return binnacleRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Binnacle> findOne(Long id) {
        log.debug("Request to get Binnacle : {}", id);
        return binnacleRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Binnacle : {}", id);
        binnacleRepository.deleteById(id);
    }
}
