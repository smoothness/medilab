package com.cenfotec.medilab.service.impl;

import com.cenfotec.medilab.domain.Invoice;
import com.cenfotec.medilab.repository.InvoiceRepository;
import com.cenfotec.medilab.service.InvoiceService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Invoice}.
 */
@Service
@Transactional
public class InvoiceServiceImpl implements InvoiceService {

    private final Logger log = LoggerFactory.getLogger(InvoiceServiceImpl.class);

    private final InvoiceRepository invoiceRepository;

    public InvoiceServiceImpl(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    @Override
    public Invoice save(Invoice invoice) {
        log.debug("Request to save Invoice : {}", invoice);
        return invoiceRepository.save(invoice);
    }

    @Override
    public Optional<Invoice> partialUpdate(Invoice invoice) {
        log.debug("Request to partially update Invoice : {}", invoice);

        return invoiceRepository
            .findById(invoice.getId())
            .map(
                existingInvoice -> {
                    if (invoice.getDate() != null) {
                        existingInvoice.setDate(invoice.getDate());
                    }
                    if (invoice.getSubtotal() != null) {
                        existingInvoice.setSubtotal(invoice.getSubtotal());
                    }
                    if (invoice.getTaxes() != null) {
                        existingInvoice.setTaxes(invoice.getTaxes());
                    }
                    if (invoice.getDiscount() != null) {
                        existingInvoice.setDiscount(invoice.getDiscount());
                    }
                    if (invoice.getTotal() != null) {
                        existingInvoice.setTotal(invoice.getTotal());
                    }
                    if (invoice.getStatus() != null) {
                        existingInvoice.setStatus(invoice.getStatus());
                    }

                    return existingInvoice;
                }
            )
            .map(invoiceRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Invoice> findAll() {
        log.debug("Request to get all Invoices");
        return invoiceRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Invoice> findOne(Long id) {
        log.debug("Request to get Invoice : {}", id);
        return invoiceRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Invoice : {}", id);
        invoiceRepository.deleteById(id);
    }
}
