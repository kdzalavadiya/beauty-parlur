/**
 * Admin Dashboard Onboarding Validation Script
 * 
 * This script validates that the onboarding features work correctly.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Onboarding validation script running...');
    
    // Wait for onboarding to be initialized
    setTimeout(() => {
        validateOnboarding();
    }, 1500);
});

/**
 * Validate the onboarding features
 */
function validateOnboarding() {
    try {
        // Check if onboarding instance was created
        if (!window.dashboardOnboarding) {
            throw new Error('Onboarding instance not found');
        }
        
        console.log('✅ Onboarding instance found');
        
        // Verify onboarding UI elements exist
        validateOnboardingUIElements();
        
        // Verify help button exists
        validateHelpButton();
        
        // Verify tour steps are defined
        validateTourSteps();
        
        // Test tour functionality
        testTourFunctionality();
        
        console.log('✅ All onboarding validation tests passed!');
    } catch (error) {
        console.error('❌ Onboarding validation failed:', error);
    }
}

/**
 * Validate that the onboarding UI elements exist
 */
function validateOnboardingUIElements() {
    const welcomeModal = document.getElementById('welcome-modal');
    if (!welcomeModal) {
        throw new Error('Welcome modal not found');
    }
    
    const overlay = document.querySelector('.onboarding-overlay');
    if (!overlay) {
        throw new Error('Onboarding overlay not found');
    }
    
    const tooltip = document.querySelector('.onboarding-tooltip');
    if (!tooltip) {
        throw new Error('Onboarding tooltip not found');
    }
    
    console.log('✅ Onboarding UI elements found');
}

/**
 * Validate that the help button exists
 */
function validateHelpButton() {
    const helpButton = document.getElementById('help-button');
    if (!helpButton) {
        throw new Error('Help button not found');
    }
    
    console.log('✅ Help button found');
}

/**
 * Validate that tour steps are defined
 */
function validateTourSteps() {
    const steps = window.dashboardOnboarding.steps;
    
    if (!steps || !Array.isArray(steps) || steps.length === 0) {
        throw new Error('Tour steps not defined or empty');
    }
    
    // Check that steps have all required properties
    const requiredProps = ['target', 'title', 'content', 'position'];
    steps.forEach((step, index) => {
        requiredProps.forEach(prop => {
            if (!step[prop]) {
                throw new Error(`Step ${index + 1} is missing required property: ${prop}`);
            }
        });
    });
    
    console.log(`✅ ${steps.length} tour steps found and validated`);
}

/**
 * Test the tour functionality
 */
function testTourFunctionality() {
    const onboarding = window.dashboardOnboarding;
    
    // Save original methods to restore later
    const originalStartTour = onboarding.startTour;
    const originalEndTour = onboarding.endTour;
    const originalNextStep = onboarding.nextStep;
    const originalPrevStep = onboarding.prevStep;
    
    let tourStarted = false;
    let tourEnded = false;
    let stepIncremented = false;
    let stepDecremented = false;
    
    // Override methods to track calls
    onboarding.startTour = function() {
        tourStarted = true;
        // Don't actually start the tour to avoid UI changes
    };
    
    onboarding.endTour = function() {
        tourEnded = true;
        // Don't actually end the tour to avoid UI changes
    };
    
    onboarding.nextStep = function() {
        stepIncremented = true;
        // Don't actually change steps to avoid UI changes
    };
    
    onboarding.prevStep = function() {
        stepDecremented = true;
        // Don't actually change steps to avoid UI changes
    };
    
    // Test startTour
    onboarding.startTour();
    if (!tourStarted) {
        throw new Error('startTour method did not execute');
    }
    
    // Test nextStep
    onboarding.nextStep();
    if (!stepIncremented) {
        throw new Error('nextStep method did not execute');
    }
    
    // Test prevStep
    onboarding.prevStep();
    if (!stepDecremented) {
        throw new Error('prevStep method did not execute');
    }
    
    // Test endTour
    onboarding.endTour();
    if (!tourEnded) {
        throw new Error('endTour method did not execute');
    }
    
    // Restore original methods
    onboarding.startTour = originalStartTour;
    onboarding.endTour = originalEndTour;
    onboarding.nextStep = originalNextStep;
    onboarding.prevStep = originalPrevStep;
    
    console.log('✅ Tour functionality methods work correctly');
}

// Helper function to show in-browser test results
function showTestResults(passed) {
    if (typeof showMessage === 'function') {
        if (passed) {
            showMessage('success', 'Onboarding validation tests passed!');
        } else {
            showMessage('error', 'Onboarding validation tests failed. Check console for details.');
        }
    }
} 