import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ErrorMessageModal from './pages/error-message-modal';
import QuizQuestion from './pages/quiz-question';
import RatingCollection from './pages/rating-collection';
import CompletionThankYou from './pages/completion-thank-you';
import AdminValidationLoading from './pages/admin-validation-loading';
import WelcomeRegistration from './pages/welcome-registration';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<WelcomeRegistration />} />
        <Route path="/error-message-modal" element={<ErrorMessageModal />} />
        <Route path="/quiz-question" element={<QuizQuestion />} />
        <Route path="/rating-collection" element={<RatingCollection />} />
        <Route path="/completion-thank-you" element={<CompletionThankYou />} />
        <Route path="/admin-validation-loading" element={<AdminValidationLoading />} />
        <Route path="/welcome-registration" element={<WelcomeRegistration />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
