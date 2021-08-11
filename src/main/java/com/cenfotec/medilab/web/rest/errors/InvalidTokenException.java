package com.cenfotec.medilab.web.rest.errors;

import org.zalando.problem.AbstractThrowableProblem;
import org.zalando.problem.Status;

public class InvalidTokenException extends AbstractThrowableProblem {

    public InvalidTokenException() {
        super(ErrorConstants.INVALID_KEY_TOKEN, "Incorrect token", Status.MOVED_PERMANENTLY);
    }
}
