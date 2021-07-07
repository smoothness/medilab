package com.cenfotec.medilab.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.medilab.IntegrationTest;
import com.cenfotec.medilab.domain.EmergencyContact;
import com.cenfotec.medilab.repository.EmergencyContactRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EmergencyContactResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EmergencyContactResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_RELATION_SHIP = "AAAAAAAAAA";
    private static final String UPDATED_RELATION_SHIP = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/emergency-contacts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EmergencyContactRepository emergencyContactRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEmergencyContactMockMvc;

    private EmergencyContact emergencyContact;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EmergencyContact createEntity(EntityManager em) {
        EmergencyContact emergencyContact = new EmergencyContact()
            .name(DEFAULT_NAME)
            .phone(DEFAULT_PHONE)
            .email(DEFAULT_EMAIL)
            .relationShip(DEFAULT_RELATION_SHIP);
        return emergencyContact;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EmergencyContact createUpdatedEntity(EntityManager em) {
        EmergencyContact emergencyContact = new EmergencyContact()
            .name(UPDATED_NAME)
            .phone(UPDATED_PHONE)
            .email(UPDATED_EMAIL)
            .relationShip(UPDATED_RELATION_SHIP);
        return emergencyContact;
    }

    @BeforeEach
    public void initTest() {
        emergencyContact = createEntity(em);
    }

    @Test
    @Transactional
    void createEmergencyContact() throws Exception {
        int databaseSizeBeforeCreate = emergencyContactRepository.findAll().size();
        // Create the EmergencyContact
        restEmergencyContactMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emergencyContact))
            )
            .andExpect(status().isCreated());

        // Validate the EmergencyContact in the database
        List<EmergencyContact> emergencyContactList = emergencyContactRepository.findAll();
        assertThat(emergencyContactList).hasSize(databaseSizeBeforeCreate + 1);
        EmergencyContact testEmergencyContact = emergencyContactList.get(emergencyContactList.size() - 1);
        assertThat(testEmergencyContact.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testEmergencyContact.getPhone()).isEqualTo(DEFAULT_PHONE);
        assertThat(testEmergencyContact.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testEmergencyContact.getRelationShip()).isEqualTo(DEFAULT_RELATION_SHIP);
    }

    @Test
    @Transactional
    void createEmergencyContactWithExistingId() throws Exception {
        // Create the EmergencyContact with an existing ID
        emergencyContact.setId(1L);

        int databaseSizeBeforeCreate = emergencyContactRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEmergencyContactMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emergencyContact))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyContact in the database
        List<EmergencyContact> emergencyContactList = emergencyContactRepository.findAll();
        assertThat(emergencyContactList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEmergencyContacts() throws Exception {
        // Initialize the database
        emergencyContactRepository.saveAndFlush(emergencyContact);

        // Get all the emergencyContactList
        restEmergencyContactMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(emergencyContact.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].relationShip").value(hasItem(DEFAULT_RELATION_SHIP)));
    }

    @Test
    @Transactional
    void getEmergencyContact() throws Exception {
        // Initialize the database
        emergencyContactRepository.saveAndFlush(emergencyContact);

        // Get the emergencyContact
        restEmergencyContactMockMvc
            .perform(get(ENTITY_API_URL_ID, emergencyContact.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(emergencyContact.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.relationShip").value(DEFAULT_RELATION_SHIP));
    }

    @Test
    @Transactional
    void getNonExistingEmergencyContact() throws Exception {
        // Get the emergencyContact
        restEmergencyContactMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEmergencyContact() throws Exception {
        // Initialize the database
        emergencyContactRepository.saveAndFlush(emergencyContact);

        int databaseSizeBeforeUpdate = emergencyContactRepository.findAll().size();

        // Update the emergencyContact
        EmergencyContact updatedEmergencyContact = emergencyContactRepository.findById(emergencyContact.getId()).get();
        // Disconnect from session so that the updates on updatedEmergencyContact are not directly saved in db
        em.detach(updatedEmergencyContact);
        updatedEmergencyContact.name(UPDATED_NAME).phone(UPDATED_PHONE).email(UPDATED_EMAIL).relationShip(UPDATED_RELATION_SHIP);

        restEmergencyContactMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEmergencyContact.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEmergencyContact))
            )
            .andExpect(status().isOk());

        // Validate the EmergencyContact in the database
        List<EmergencyContact> emergencyContactList = emergencyContactRepository.findAll();
        assertThat(emergencyContactList).hasSize(databaseSizeBeforeUpdate);
        EmergencyContact testEmergencyContact = emergencyContactList.get(emergencyContactList.size() - 1);
        assertThat(testEmergencyContact.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEmergencyContact.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testEmergencyContact.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testEmergencyContact.getRelationShip()).isEqualTo(UPDATED_RELATION_SHIP);
    }

    @Test
    @Transactional
    void putNonExistingEmergencyContact() throws Exception {
        int databaseSizeBeforeUpdate = emergencyContactRepository.findAll().size();
        emergencyContact.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmergencyContactMockMvc
            .perform(
                put(ENTITY_API_URL_ID, emergencyContact.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emergencyContact))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyContact in the database
        List<EmergencyContact> emergencyContactList = emergencyContactRepository.findAll();
        assertThat(emergencyContactList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEmergencyContact() throws Exception {
        int databaseSizeBeforeUpdate = emergencyContactRepository.findAll().size();
        emergencyContact.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmergencyContactMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emergencyContact))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyContact in the database
        List<EmergencyContact> emergencyContactList = emergencyContactRepository.findAll();
        assertThat(emergencyContactList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEmergencyContact() throws Exception {
        int databaseSizeBeforeUpdate = emergencyContactRepository.findAll().size();
        emergencyContact.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmergencyContactMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(emergencyContact))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EmergencyContact in the database
        List<EmergencyContact> emergencyContactList = emergencyContactRepository.findAll();
        assertThat(emergencyContactList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEmergencyContactWithPatch() throws Exception {
        // Initialize the database
        emergencyContactRepository.saveAndFlush(emergencyContact);

        int databaseSizeBeforeUpdate = emergencyContactRepository.findAll().size();

        // Update the emergencyContact using partial update
        EmergencyContact partialUpdatedEmergencyContact = new EmergencyContact();
        partialUpdatedEmergencyContact.setId(emergencyContact.getId());

        partialUpdatedEmergencyContact.name(UPDATED_NAME).phone(UPDATED_PHONE).relationShip(UPDATED_RELATION_SHIP);

        restEmergencyContactMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmergencyContact.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEmergencyContact))
            )
            .andExpect(status().isOk());

        // Validate the EmergencyContact in the database
        List<EmergencyContact> emergencyContactList = emergencyContactRepository.findAll();
        assertThat(emergencyContactList).hasSize(databaseSizeBeforeUpdate);
        EmergencyContact testEmergencyContact = emergencyContactList.get(emergencyContactList.size() - 1);
        assertThat(testEmergencyContact.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEmergencyContact.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testEmergencyContact.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testEmergencyContact.getRelationShip()).isEqualTo(UPDATED_RELATION_SHIP);
    }

    @Test
    @Transactional
    void fullUpdateEmergencyContactWithPatch() throws Exception {
        // Initialize the database
        emergencyContactRepository.saveAndFlush(emergencyContact);

        int databaseSizeBeforeUpdate = emergencyContactRepository.findAll().size();

        // Update the emergencyContact using partial update
        EmergencyContact partialUpdatedEmergencyContact = new EmergencyContact();
        partialUpdatedEmergencyContact.setId(emergencyContact.getId());

        partialUpdatedEmergencyContact.name(UPDATED_NAME).phone(UPDATED_PHONE).email(UPDATED_EMAIL).relationShip(UPDATED_RELATION_SHIP);

        restEmergencyContactMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmergencyContact.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEmergencyContact))
            )
            .andExpect(status().isOk());

        // Validate the EmergencyContact in the database
        List<EmergencyContact> emergencyContactList = emergencyContactRepository.findAll();
        assertThat(emergencyContactList).hasSize(databaseSizeBeforeUpdate);
        EmergencyContact testEmergencyContact = emergencyContactList.get(emergencyContactList.size() - 1);
        assertThat(testEmergencyContact.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEmergencyContact.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testEmergencyContact.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testEmergencyContact.getRelationShip()).isEqualTo(UPDATED_RELATION_SHIP);
    }

    @Test
    @Transactional
    void patchNonExistingEmergencyContact() throws Exception {
        int databaseSizeBeforeUpdate = emergencyContactRepository.findAll().size();
        emergencyContact.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmergencyContactMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, emergencyContact.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(emergencyContact))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyContact in the database
        List<EmergencyContact> emergencyContactList = emergencyContactRepository.findAll();
        assertThat(emergencyContactList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEmergencyContact() throws Exception {
        int databaseSizeBeforeUpdate = emergencyContactRepository.findAll().size();
        emergencyContact.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmergencyContactMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(emergencyContact))
            )
            .andExpect(status().isBadRequest());

        // Validate the EmergencyContact in the database
        List<EmergencyContact> emergencyContactList = emergencyContactRepository.findAll();
        assertThat(emergencyContactList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEmergencyContact() throws Exception {
        int databaseSizeBeforeUpdate = emergencyContactRepository.findAll().size();
        emergencyContact.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmergencyContactMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(emergencyContact))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EmergencyContact in the database
        List<EmergencyContact> emergencyContactList = emergencyContactRepository.findAll();
        assertThat(emergencyContactList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEmergencyContact() throws Exception {
        // Initialize the database
        emergencyContactRepository.saveAndFlush(emergencyContact);

        int databaseSizeBeforeDelete = emergencyContactRepository.findAll().size();

        // Delete the emergencyContact
        restEmergencyContactMockMvc
            .perform(delete(ENTITY_API_URL_ID, emergencyContact.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EmergencyContact> emergencyContactList = emergencyContactRepository.findAll();
        assertThat(emergencyContactList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
