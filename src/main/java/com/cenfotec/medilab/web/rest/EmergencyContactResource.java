package com.cenfotec.medilab.web.rest;

import com.cenfotec.medilab.domain.EmergencyContact;
import com.cenfotec.medilab.repository.EmergencyContactRepository;
import com.cenfotec.medilab.service.EmergencyContactService;
import com.cenfotec.medilab.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.cenfotec.medilab.domain.EmergencyContact}.
 */
@RestController
@RequestMapping("/api")
public class EmergencyContactResource {

    private final Logger log = LoggerFactory.getLogger(EmergencyContactResource.class);

    private static final String ENTITY_NAME = "emergencyContact";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EmergencyContactService emergencyContactService;

    private final EmergencyContactRepository emergencyContactRepository;

    public EmergencyContactResource(
        EmergencyContactService emergencyContactService,
        EmergencyContactRepository emergencyContactRepository
    ) {
        this.emergencyContactService = emergencyContactService;
        this.emergencyContactRepository = emergencyContactRepository;
    }

    /**
     * {@code POST  /emergency-contacts} : Create a new emergencyContact.
     *
     * @param emergencyContact the emergencyContact to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new emergencyContact, or with status {@code 400 (Bad Request)} if the emergencyContact has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/emergency-contacts")
    public ResponseEntity<EmergencyContact> createEmergencyContact(@RequestBody EmergencyContact emergencyContact)
        throws URISyntaxException {
        log.debug("REST request to save EmergencyContact : {}", emergencyContact);
        if (emergencyContact.getId() != null) {
            throw new BadRequestAlertException("A new emergencyContact cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EmergencyContact result = emergencyContactService.save(emergencyContact);
        return ResponseEntity
            .created(new URI("/api/emergency-contacts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /emergency-contacts/:id} : Updates an existing emergencyContact.
     *
     * @param id the id of the emergencyContact to save.
     * @param emergencyContact the emergencyContact to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated emergencyContact,
     * or with status {@code 400 (Bad Request)} if the emergencyContact is not valid,
     * or with status {@code 500 (Internal Server Error)} if the emergencyContact couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/emergency-contacts/{id}")
    public ResponseEntity<EmergencyContact> updateEmergencyContact(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EmergencyContact emergencyContact
    ) throws URISyntaxException {
        log.debug("REST request to update EmergencyContact : {}, {}", id, emergencyContact);
        if (emergencyContact.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, emergencyContact.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!emergencyContactRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EmergencyContact result = emergencyContactService.save(emergencyContact);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, emergencyContact.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /emergency-contacts/:id} : Partial updates given fields of an existing emergencyContact, field will ignore if it is null
     *
     * @param id the id of the emergencyContact to save.
     * @param emergencyContact the emergencyContact to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated emergencyContact,
     * or with status {@code 400 (Bad Request)} if the emergencyContact is not valid,
     * or with status {@code 404 (Not Found)} if the emergencyContact is not found,
     * or with status {@code 500 (Internal Server Error)} if the emergencyContact couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/emergency-contacts/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<EmergencyContact> partialUpdateEmergencyContact(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EmergencyContact emergencyContact
    ) throws URISyntaxException {
        log.debug("REST request to partial update EmergencyContact partially : {}, {}", id, emergencyContact);
        if (emergencyContact.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, emergencyContact.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!emergencyContactRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EmergencyContact> result = emergencyContactService.partialUpdate(emergencyContact);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, emergencyContact.getId().toString())
        );
    }

    /**
     * {@code GET  /emergency-contacts} : get all the emergencyContacts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of emergencyContacts in body.
     */
    @GetMapping("/emergency-contacts")
    public List<EmergencyContact> getAllEmergencyContacts() {
        log.debug("REST request to get all EmergencyContacts");
        return emergencyContactService.findAll();
    }

    /**
     * {@code GET  /emergency-contacts/:id} : get the "id" emergencyContact.
     *
     * @param id the id of the emergencyContact to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the emergencyContact, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/emergency-contacts/{id}")
    public ResponseEntity<EmergencyContact> getEmergencyContact(@PathVariable Long id) {
        log.debug("REST request to get EmergencyContact : {}", id);
        Optional<EmergencyContact> emergencyContact = emergencyContactService.findOne(id);
        return ResponseUtil.wrapOrNotFound(emergencyContact);
    }

    @GetMapping("/emergency-contacts-patient/{id}")
    public ResponseEntity<List<EmergencyContact>> getEmergencyContactByPatientId(@PathVariable Long id) {
        List<EmergencyContact> emergencyContacts = emergencyContactService.findByPatientId(id);
        return ResponseEntity.ok(emergencyContacts);
    }

    /**
     * {@code DELETE  /emergency-contacts/:id} : delete the "id" emergencyContact.
     *
     * @param id the id of the emergencyContact to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/emergency-contacts/{id}")
    public ResponseEntity<Void> deleteEmergencyContact(@PathVariable Long id) {
        log.debug("REST request to delete EmergencyContact : {}", id);
        emergencyContactService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
