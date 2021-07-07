package com.cenfotec.medilab.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.medilab.IntegrationTest;
import com.cenfotec.medilab.domain.MedicalExams;
import com.cenfotec.medilab.repository.MedicalExamsRepository;
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
 * Integration tests for the {@link MedicalExamsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MedicalExamsResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Boolean DEFAULT_REMOVED = false;
    private static final Boolean UPDATED_REMOVED = true;

    private static final String ENTITY_API_URL = "/api/medical-exams";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MedicalExamsRepository medicalExamsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMedicalExamsMockMvc;

    private MedicalExams medicalExams;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MedicalExams createEntity(EntityManager em) {
        MedicalExams medicalExams = new MedicalExams().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION).removed(DEFAULT_REMOVED);
        return medicalExams;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MedicalExams createUpdatedEntity(EntityManager em) {
        MedicalExams medicalExams = new MedicalExams().name(UPDATED_NAME).description(UPDATED_DESCRIPTION).removed(UPDATED_REMOVED);
        return medicalExams;
    }

    @BeforeEach
    public void initTest() {
        medicalExams = createEntity(em);
    }

    @Test
    @Transactional
    void createMedicalExams() throws Exception {
        int databaseSizeBeforeCreate = medicalExamsRepository.findAll().size();
        // Create the MedicalExams
        restMedicalExamsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(medicalExams))
            )
            .andExpect(status().isCreated());

        // Validate the MedicalExams in the database
        List<MedicalExams> medicalExamsList = medicalExamsRepository.findAll();
        assertThat(medicalExamsList).hasSize(databaseSizeBeforeCreate + 1);
        MedicalExams testMedicalExams = medicalExamsList.get(medicalExamsList.size() - 1);
        assertThat(testMedicalExams.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testMedicalExams.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testMedicalExams.getRemoved()).isEqualTo(DEFAULT_REMOVED);
    }

    @Test
    @Transactional
    void createMedicalExamsWithExistingId() throws Exception {
        // Create the MedicalExams with an existing ID
        medicalExams.setId(1L);

        int databaseSizeBeforeCreate = medicalExamsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMedicalExamsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(medicalExams))
            )
            .andExpect(status().isBadRequest());

        // Validate the MedicalExams in the database
        List<MedicalExams> medicalExamsList = medicalExamsRepository.findAll();
        assertThat(medicalExamsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMedicalExams() throws Exception {
        // Initialize the database
        medicalExamsRepository.saveAndFlush(medicalExams);

        // Get all the medicalExamsList
        restMedicalExamsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(medicalExams.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].removed").value(hasItem(DEFAULT_REMOVED.booleanValue())));
    }

    @Test
    @Transactional
    void getMedicalExams() throws Exception {
        // Initialize the database
        medicalExamsRepository.saveAndFlush(medicalExams);

        // Get the medicalExams
        restMedicalExamsMockMvc
            .perform(get(ENTITY_API_URL_ID, medicalExams.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(medicalExams.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.removed").value(DEFAULT_REMOVED.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingMedicalExams() throws Exception {
        // Get the medicalExams
        restMedicalExamsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewMedicalExams() throws Exception {
        // Initialize the database
        medicalExamsRepository.saveAndFlush(medicalExams);

        int databaseSizeBeforeUpdate = medicalExamsRepository.findAll().size();

        // Update the medicalExams
        MedicalExams updatedMedicalExams = medicalExamsRepository.findById(medicalExams.getId()).get();
        // Disconnect from session so that the updates on updatedMedicalExams are not directly saved in db
        em.detach(updatedMedicalExams);
        updatedMedicalExams.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).removed(UPDATED_REMOVED);

        restMedicalExamsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMedicalExams.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMedicalExams))
            )
            .andExpect(status().isOk());

        // Validate the MedicalExams in the database
        List<MedicalExams> medicalExamsList = medicalExamsRepository.findAll();
        assertThat(medicalExamsList).hasSize(databaseSizeBeforeUpdate);
        MedicalExams testMedicalExams = medicalExamsList.get(medicalExamsList.size() - 1);
        assertThat(testMedicalExams.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMedicalExams.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testMedicalExams.getRemoved()).isEqualTo(UPDATED_REMOVED);
    }

    @Test
    @Transactional
    void putNonExistingMedicalExams() throws Exception {
        int databaseSizeBeforeUpdate = medicalExamsRepository.findAll().size();
        medicalExams.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMedicalExamsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, medicalExams.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(medicalExams))
            )
            .andExpect(status().isBadRequest());

        // Validate the MedicalExams in the database
        List<MedicalExams> medicalExamsList = medicalExamsRepository.findAll();
        assertThat(medicalExamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMedicalExams() throws Exception {
        int databaseSizeBeforeUpdate = medicalExamsRepository.findAll().size();
        medicalExams.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMedicalExamsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(medicalExams))
            )
            .andExpect(status().isBadRequest());

        // Validate the MedicalExams in the database
        List<MedicalExams> medicalExamsList = medicalExamsRepository.findAll();
        assertThat(medicalExamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMedicalExams() throws Exception {
        int databaseSizeBeforeUpdate = medicalExamsRepository.findAll().size();
        medicalExams.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMedicalExamsMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(medicalExams))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MedicalExams in the database
        List<MedicalExams> medicalExamsList = medicalExamsRepository.findAll();
        assertThat(medicalExamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMedicalExamsWithPatch() throws Exception {
        // Initialize the database
        medicalExamsRepository.saveAndFlush(medicalExams);

        int databaseSizeBeforeUpdate = medicalExamsRepository.findAll().size();

        // Update the medicalExams using partial update
        MedicalExams partialUpdatedMedicalExams = new MedicalExams();
        partialUpdatedMedicalExams.setId(medicalExams.getId());

        partialUpdatedMedicalExams.description(UPDATED_DESCRIPTION);

        restMedicalExamsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMedicalExams.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMedicalExams))
            )
            .andExpect(status().isOk());

        // Validate the MedicalExams in the database
        List<MedicalExams> medicalExamsList = medicalExamsRepository.findAll();
        assertThat(medicalExamsList).hasSize(databaseSizeBeforeUpdate);
        MedicalExams testMedicalExams = medicalExamsList.get(medicalExamsList.size() - 1);
        assertThat(testMedicalExams.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testMedicalExams.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testMedicalExams.getRemoved()).isEqualTo(DEFAULT_REMOVED);
    }

    @Test
    @Transactional
    void fullUpdateMedicalExamsWithPatch() throws Exception {
        // Initialize the database
        medicalExamsRepository.saveAndFlush(medicalExams);

        int databaseSizeBeforeUpdate = medicalExamsRepository.findAll().size();

        // Update the medicalExams using partial update
        MedicalExams partialUpdatedMedicalExams = new MedicalExams();
        partialUpdatedMedicalExams.setId(medicalExams.getId());

        partialUpdatedMedicalExams.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).removed(UPDATED_REMOVED);

        restMedicalExamsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMedicalExams.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMedicalExams))
            )
            .andExpect(status().isOk());

        // Validate the MedicalExams in the database
        List<MedicalExams> medicalExamsList = medicalExamsRepository.findAll();
        assertThat(medicalExamsList).hasSize(databaseSizeBeforeUpdate);
        MedicalExams testMedicalExams = medicalExamsList.get(medicalExamsList.size() - 1);
        assertThat(testMedicalExams.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMedicalExams.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testMedicalExams.getRemoved()).isEqualTo(UPDATED_REMOVED);
    }

    @Test
    @Transactional
    void patchNonExistingMedicalExams() throws Exception {
        int databaseSizeBeforeUpdate = medicalExamsRepository.findAll().size();
        medicalExams.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMedicalExamsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, medicalExams.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(medicalExams))
            )
            .andExpect(status().isBadRequest());

        // Validate the MedicalExams in the database
        List<MedicalExams> medicalExamsList = medicalExamsRepository.findAll();
        assertThat(medicalExamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMedicalExams() throws Exception {
        int databaseSizeBeforeUpdate = medicalExamsRepository.findAll().size();
        medicalExams.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMedicalExamsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(medicalExams))
            )
            .andExpect(status().isBadRequest());

        // Validate the MedicalExams in the database
        List<MedicalExams> medicalExamsList = medicalExamsRepository.findAll();
        assertThat(medicalExamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMedicalExams() throws Exception {
        int databaseSizeBeforeUpdate = medicalExamsRepository.findAll().size();
        medicalExams.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMedicalExamsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(medicalExams))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MedicalExams in the database
        List<MedicalExams> medicalExamsList = medicalExamsRepository.findAll();
        assertThat(medicalExamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMedicalExams() throws Exception {
        // Initialize the database
        medicalExamsRepository.saveAndFlush(medicalExams);

        int databaseSizeBeforeDelete = medicalExamsRepository.findAll().size();

        // Delete the medicalExams
        restMedicalExamsMockMvc
            .perform(delete(ENTITY_API_URL_ID, medicalExams.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MedicalExams> medicalExamsList = medicalExamsRepository.findAll();
        assertThat(medicalExamsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
