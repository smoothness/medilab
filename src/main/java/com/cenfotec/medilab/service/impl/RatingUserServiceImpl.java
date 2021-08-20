package com.cenfotec.medilab.service.impl;

import com.cenfotec.medilab.domain.RatingUser;
import com.cenfotec.medilab.repository.RatingUserRepository;
import com.cenfotec.medilab.service.RatingUserService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link RatingUser}.
 */
@Service
@Transactional
public class RatingUserServiceImpl implements RatingUserService {

    private final Logger log = LoggerFactory.getLogger(RatingUserServiceImpl.class);

    private final RatingUserRepository ratingUserRepository;

    public RatingUserServiceImpl(RatingUserRepository ratingUserRepository) {
        this.ratingUserRepository = ratingUserRepository;
    }

    @Override
    public RatingUser save(RatingUser ratingUser) {
        log.debug("Request to save RatingUser : {}", ratingUser);
        return ratingUserRepository.save(ratingUser);
    }

    @Override
    public Optional<RatingUser> partialUpdate(RatingUser ratingUser) {
        log.debug("Request to partially update RatingUser : {}", ratingUser);

        return ratingUserRepository
            .findById(ratingUser.getId())
            .map(
                existingRatingUser -> {
                    return existingRatingUser;
                }
            )
            .map(ratingUserRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RatingUser> findAll() {
        log.debug("Request to get all RatingUsers");
        return ratingUserRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<RatingUser> findOne(Long id) {
        log.debug("Request to get RatingUser : {}", id);
        return ratingUserRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Object findAverageByDoctor(Long id) {
        return ratingUserRepository.findAverageByDoctor(id);
    }

    @Override
    public void delete(Long id) {
        ratingUserRepository.deleteById(id);
    }
}
