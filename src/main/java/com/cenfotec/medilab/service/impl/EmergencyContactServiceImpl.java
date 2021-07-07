package com.cenfotec.medilab.service.impl;

import com.cenfotec.medilab.domain.EmergencyContact;
import com.cenfotec.medilab.repository.EmergencyContactRepository;
import com.cenfotec.medilab.service.EmergencyContactService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link EmergencyContact}.
 */
@Service
@Transactional
public class EmergencyContactServiceImpl implements EmergencyContactService {

    private final Logger log = LoggerFactory.getLogger(EmergencyContactServiceImpl.class);

    private final EmergencyContactRepository emergencyContactRepository;

    public EmergencyContactServiceImpl(EmergencyContactRepository emergencyContactRepository) {
        this.emergencyContactRepository = emergencyContactRepository;
    }

    @Override
    public EmergencyContact save(EmergencyContact emergencyContact) {
        log.debug("Request to save EmergencyContact : {}", emergencyContact);
        return emergencyContactRepository.save(emergencyContact);
    }

    @Override
    public Optional<EmergencyContact> partialUpdate(EmergencyContact emergencyContact) {
        log.debug("Request to partially update EmergencyContact : {}", emergencyContact);

        return emergencyContactRepository
            .findById(emergencyContact.getId())
            .map(
                existingEmergencyContact -> {
                    if (emergencyContact.getName() != null) {
                        existingEmergencyContact.setName(emergencyContact.getName());
                    }
                    if (emergencyContact.getPhone() != null) {
                        existingEmergencyContact.setPhone(emergencyContact.getPhone());
                    }
                    if (emergencyContact.getEmail() != null) {
                        existingEmergencyContact.setEmail(emergencyContact.getEmail());
                    }
                    if (emergencyContact.getRelationShip() != null) {
                        existingEmergencyContact.setRelationShip(emergencyContact.getRelationShip());
                    }

                    return existingEmergencyContact;
                }
            )
            .map(emergencyContactRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmergencyContact> findAll() {
        log.debug("Request to get all EmergencyContacts");
        return emergencyContactRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EmergencyContact> findOne(Long id) {
        log.debug("Request to get EmergencyContact : {}", id);
        return emergencyContactRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete EmergencyContact : {}", id);
        emergencyContactRepository.deleteById(id);
    }
}
