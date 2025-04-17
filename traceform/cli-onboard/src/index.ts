#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { checkPrerequisites } from './steps/prerequisites';
import { checkVSCodeExtension } from './steps/vscode';
import { checkBabelPlugin } from './steps/babel';
import { checkBrowserExtension } from './steps/browser';
import { runValidation } from './steps/validate';

const program = new Command();

program
  .version('0.1.0') // TODO: Sync with package.json
  .description('Traceform Onboarding Wizard');

program
  .command('check')
  .description('Run the Traceform setup check and onboarding guide')
  .action(async () => {
    console.log(chalk.bold.cyan('🚀 Starting Traceform Setup Check...'));

    let allChecksPassed = true;

    try {
      console.log(chalk.blue('\n--- Step 1: Prerequisites ---'));
      const prereqsPassed = await checkPrerequisites();
      if (!prereqsPassed) {
        // Exit early if prerequisites are not met
        console.log(chalk.red.bold('\n❌ Prerequisite checks failed. Please resolve the issues above before proceeding.'));
        process.exit(1);
      }
      allChecksPassed = true; // Reset flag as we passed prereqs

      // --- Step 2: Babel Plugin --- (Moved Up)
      console.log(chalk.blue('\n--- Step 2: Babel Plugin ---'));
      const babelPassed = await checkBabelPlugin();
      if (!babelPassed) allChecksPassed = false;

      // --- Step 3: VS Code Extension --- (Moved Down)
      console.log(chalk.blue('\n--- Step 3: VS Code Extension ---'));
      const vscodePassed = await checkVSCodeExtension();
      // We might not set allChecksPassed to false here if it's just a manual guide + prompt
      // Let the prompt handle confirmation.

      // --- Step 4: Browser Extension --- (Moved Down)
      console.log(chalk.blue('\n--- Step 4: Browser Extension ---'));
      const browserPassed = await checkBrowserExtension();
      // We might not set allChecksPassed to false here if it's just a manual guide + prompt
      // Let the prompt handle confirmation.


      // --- Step 5: Validation --- (Only if Babel passed, others are guided)
      if (babelPassed) { // Only proceed to validation if core Babel setup is likely correct
        console.log(chalk.green.bold('\n⚙️ Core setup checks complete. Proceeding to guided steps & validation...'));
        // Re-check vscode/browser confirmation within their functions using inquirer
        const vscodeConfirmed = await checkVSCodeExtension(); // Will now use inquirer
        const browserConfirmed = await checkBrowserExtension(); // Will now use inquirer

        if (vscodeConfirmed && browserConfirmed) {
           console.log(chalk.blue('\n--- Step 5: Final Validation ---'));
           await runValidation(); // Will now use inquirer
        } else {
           console.log(chalk.yellow.bold('\n⚠️ Please complete the VS Code and Browser extension steps before final validation.'));
        }
      } else {
        console.log(chalk.yellow.bold('\n⚠️ Babel plugin setup needs attention. Cannot proceed to validation.'));
        console.log(chalk.yellow('Once fixed, run the check again.'));
      }

      // Original logic removed/modified above
      // if (allChecksPassed) {
      //   console.log(chalk.green.bold('\n✅ All setup checks passed!'));
      //   console.log(chalk.blue('\n--- Step 5: Validation ---'));
      //   await runValidation();
      // } else {
      //   console.log(chalk.yellow.bold('\n⚠️ Some setup steps are incomplete. Please follow the instructions above.'));
      //   console.log(chalk.yellow('Once fixed, run `npx @lucidlayer/traceform-onboard check` again.'));
      // }

    } catch (error) {
      console.error(chalk.red('\n❌ An unexpected error occurred:'), error);
      process.exit(1);
    }

    console.log(chalk.bold.cyan('\n✨ Traceform Setup Check Complete!'));
  });

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}
