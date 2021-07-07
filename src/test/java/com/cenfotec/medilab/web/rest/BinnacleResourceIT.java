package com.cenfotec.medilab.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cenfotec.medilab.IntegrationTest;
import com.cenfotec.medilab.domain.Binnacle;
import com.cenfotec.medilab.repository.BinnacleRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link BinnacleResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BinnacleResourceIT {

    private static final String DEFAULT_DOCTOR_CODE = "AAAAAAAAAA";
    private static final String UPDATED_DOCTOR_CODE = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/binnacles";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BinnacleRepository binnacleRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBinnacleMockMvc;

    private Binnacle binnacle;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Binnacle createEntity(EntityManager em) {
        Binnacle binnacle = new Binnacle().doctorCode(DEFAULT_DOCTOR_CODE).date(DEFAULT_DATE);
        return binnacle;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Binnacle createUpdatedEntity(EntityManager em) {
        Binnacle binnacle = new Binnacle().doctorCode(UPDATED_DOCTOR_CODE).date(UPDATED_DATE);
        return binnacle;
    }

    @BeforeEach
    public void initTest() {
        binnacle = createEntity(em);
    }

    @Test
    @Transactional
    void createBinnacle() throws Exception {
        int databaseSizeBeforeCreate = binnacleRepository.findAll().size();
        // Create the Binnacle
        restBinnacleMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(binnacle))
            )
            .andExpect(status().isCreated());

        // Validate the Binnacle in the database
        List<Binnacle> binnacleList = binnacleRepository.findAll();
        assertThat(binnacleList).hasSize(databaseSizeBeforeCreate + 1);
        Binnacle testBinnacle = binnacleList.get(binnacleList.size() - 1);
        assertThat(testBinnacle.getDoctorCode()).isEqualTo(DEFAULT_DOCTOR_CODE);
        assertThat(testBinnacle.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createBinnacleWithExistingId() throws Exception {
        // Create the Binnacle with an existing ID
        binnacle.setId(1L);

        int databaseSizeBeforeCreate = binnacleRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBinnacleMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(binnacle))
            )
            .andExpect(status().isBadRequest());

        // Validate the Binnacle in the database
        List<Binnacle> binnacleList = binnacleRepository.findAll();
        assertThat(binnacleList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBinnacles() throws Exception {
        // Initialize the database
        binnacleRepository.saveAndFlush(binnacle);

        // Get all the binnacleList
        restBinnacleMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(binnacle.getId().intValue())))
            .andExpect(jsonPath("$.[*].doctorCode").value(hasItem(DEFAULT_DOCTOR_CODE)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    void getBinnacle() throws Exception {
        // Initialize the database
        binnacleRepository.saveAndFlush(binnacle);

        // Get the binnacle
        restBinnacleMockMvc
            .perform(get(ENTITY_API_URL_ID, binnacle.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(binnacle.getId().intValue()))
            .andExpect(jsonPath("$.doctorCode").value(DEFAULT_DOCTOR_CODE))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingBinnacle() throws Exception {
        // Get the binnacle
        restBinnacleMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBinnacle() throws Exception {
        // Initialize the database
        binnacleRepository.saveAndFlush(binnacle);

        int databaseSizeBeforeUpdate = binnacleRepository.findAll().size();

        // Update the binnacle
        Binnacle updatedBinnacle = binnacleRepository.findById(binnacle.getId()).get();
        // Disconnect from session so that the updates on updatedBinnacle are not directly saved in db
        em.detach(updatedBinnacle);
        updatedBinnacle.doctorCode(UPDATED_DOCTOR_CODE).date(UPDATED_DATE);

        restBinnacleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBinnacle.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBinnacle))
            )
            .andExpect(status().isOk());

        // Validate the Binnacle in the database
        List<Binnacle> binnacleList = binnacleRepository.findAll();
        assertThat(binnacleList).hasSize(databaseSizeBeforeUpdate);
        Binnacle testBinnacle = binnacleList.get(binnacleList.size() - 1);
        assertThat(testBinnacle.getDoctorCode()).isEqualTo(UPDATED_DOCTOR_CODE);
        assertThat(testBinnacle.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingBinnacle() throws Exception {
        int databaseSizeBeforeUpdate = binnacleRepository.findAll().size();
        binnacle.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBinnacleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, binnacle.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(binnacle))
            )
            .andExpect(status().isBadRequest());

        // Validate the Binnacle in the database
        List<Binnacle> binnacleList = binnacleRepository.findAll();
        assertThat(binnacleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBinnacle() throws Exception {
        int databaseSizeBeforeUpdate = binnacleRepository.findAll().size();
        binnacle.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBinnacleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(binnacle))
            )
            .andExpect(status().isBadRequest());

        // Validate the Binnacle in the database
        List<Binnacle> binnacleList = binnacleRepository.findAll();
        assertThat(binnacleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBinnacle() throws Exception {
        int databaseSizeBeforeUpdate = binnacleRepository.findAll().size();
        binnacle.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBinnacleMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(binnacle))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Binnacle in the database
        List<Binnacle> binnacleList = binnacleRepository.findAll();
        assertThat(binnacleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBinnacleWithPatch() throws Exception {
        // Initialize the database
        binnacleRepository.saveAndFlush(binnacle);

        int databaseSizeBeforeUpdate = binnacleRepository.findAll().size();

        // Update the binnacle using partial update
        Binnacle partialUpdatedBinnacle = new Binnacle();
        partialUpdatedBinnacle.setId(binnacle.getId());

        partialUpdatedBinnacle.doctorCode(UPDATED_DOCTOR_CODE);

        restBinnacleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBinnacle.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBinnacle))
            )
            .andExpect(status().isOk());

        // Validate the Binnacle in the database
        List<Binnacle> binnacleList = binnacleRepository.findAll();
        assertThat(binnacleList).hasSize(databaseSizeBeforeUpdate);
        Binnacle testBinnacle = binnacleList.get(binnacleList.size() - 1);
        assertThat(testBinnacle.getDoctorCode()).isEqualTo(UPDATED_DOCTOR_CODE);
        assertThat(testBinnacle.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateBinnacleWithPatch() throws Exception {
        // Initialize the database
        binnacleRepository.saveAndFlush(binnacle);

        int databaseSizeBeforeUpdate = binnacleRepository.findAll().size();

        // Update the binnacle using partial update
        Binnacle partialUpdatedBinnacle = new Binnacle();
        partialUpdatedBinnacle.setId(binnacle.getId());

        partialUpdatedBinnacle.doctorCode(UPDATED_DOCTOR_CODE).date(UPDATED_DATE);

        restBinnacleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBinnacle.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBinnacle))
            )
            .andExpect(status().isOk());

        // Validate the Binnacle in the database
        List<Binnacle> binnacleList = binnacleRepository.findAll();
        assertThat(binnacleList).hasSize(databaseSizeBeforeUpdate);
        Binnacle testBinnacle = binnacleList.get(binnacleList.size() - 1);
        assertThat(testBinnacle.getDoctorCode()).isEqualTo(UPDATED_DOCTOR_CODE);
        assertThat(testBinnacle.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingBinnacle() throws Exception {
        int databaseSizeBeforeUpdate = binnacleRepository.findAll().size();
        binnacle.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBinnacleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, binnacle.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(binnacle))
            )
            .andExpect(status().isBadRequest());

        // Validate the Binnacle in the database
        List<Binnacle> binnacleList = binnacleRepository.findAll();
        assertThat(binnacleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBinnacle() throws Exception {
        int databaseSizeBeforeUpdate = binnacleRepository.findAll().size();
        binnacle.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBinnacleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(binnacle))
            )
            .andExpect(status().isBadRequest());

        // Validate the Binnacle in the database
        List<Binnacle> binnacleList = binnacleRepository.findAll();
        assertThat(binnacleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBinnacle() throws Exception {
        int databaseSizeBeforeUpdate = binnacleRepository.findAll().size();
        binnacle.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBinnacleMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(binnacle))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Binnacle in the database
        List<Binnacle> binnacleList = binnacleRepository.findAll();
        assertThat(binnacleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBinnacle() throws Exception {
        // Initialize the database
        binnacleRepository.saveAndFlush(binnacle);

        int databaseSizeBeforeDelete = binnacleRepository.findAll().size();

        // Delete the binnacle
        restBinnacleMockMvc
            .perform(delete(ENTITY_API_URL_ID, binnacle.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Binnacle> binnacleList = binnacleRepository.findAll();
        assertThat(binnacleList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
