#!/usr/bin/env node

import { Command } from 'commander';
// Removed static chalk import
import inquirer from 'inquirer'; // Import inquirer
import { checkPrerequisites } from './steps/prerequisites';
import { checkVSCodeExtension } from './steps/vscode';
import { checkBabelPlugin } from './steps/babel'; // checkBabelPlugin now returns 'passed' | 'failed_dependency' | 'failed_config'
import { checkBrowserExtension } from './steps/browser';
import { runValidation } from './steps/validate';

const program = new Command();

program
  .version('0.1.0') // TODO: Sync with package.json
  .description('Traceform Onboarding Wizard');

program
  .command('check')
  .description('Run the Traceform setup check and onboarding guide')
  .option('-v, --verbose', 'Display more detailed logging output')
  .action(async (options) => { // Add options parameter
    // Dynamically import chalk
    const chalk = (await import('chalk')).default;
    const verboseLog = options.verbose ? console.log : () => {}; // Simple verbose logger
    console.log(chalk.bold.cyan('🚀 Starting Traceform Setup Check...'));
    verboseLog(chalk.gray(`Verbose logging enabled.`));

    let allChecksPassed = true;

    try {
      console.log(chalk.blue('\n--- Step 1: Prerequisites ---'));
      const prereqsPassed = await checkPrerequisites(verboseLog); // Pass logger
      if (!prereqsPassed) {
        // Exit early if prerequisites are not met
        console.log(chalk.red.bold('\n❌ Prerequisite checks failed. Please resolve the issues above before proceeding.'));
        process.exit(1);
      }
      allChecksPassed = true; // Reset flag as we passed prereqs

      // --- Step 2: Babel Plugin --- (With Re-check Loop)
      let babelStatus: Awaited<ReturnType<typeof checkBabelPlugin>>;
      let babelPassed = false;
      do {
        console.log(chalk.blue('\n--- Step 2: Babel Plugin ---'));
        babelStatus = await checkBabelPlugin(verboseLog); // Pass logger
        babelPassed = babelStatus === 'passed';

        if (babelStatus === 'failed_config') {
          const { recheck } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'recheck',
              message: 'Babel configuration seems missing. After adding the snippet above, do you want to re-check the configuration?',
              default: true,
            },
          ]);
          if (!recheck) {
             console.log(chalk.yellow('Skipping Babel configuration re-check. You can run the wizard again later.'));
             break; // Exit loop if user doesn't want to recheck
          }
        } else if (babelStatus === 'failed_dependency') {
           // User likely declined install or install failed, break loop
           break;
        }
      } while (babelStatus === 'failed_config'); // Loop only if config failed and user wants to recheck

      if (!babelPassed) allChecksPassed = false; // Set overall flag if Babel didn't pass

      // --- Step 3: VS Code Extension --- (Moved Down)
      console.log(chalk.blue('\n--- Step 3: VS Code Extension ---'));
      // VS Code check is mostly instructional, verbose logger might not be needed unless we add more checks later
      const vscodePassed = await checkVSCodeExtension();
      // We might not set allChecksPassed to false here if it's just a manual guide + prompt
      // Let the prompt handle confirmation.

      // --- Step 4: Browser Extension --- (Moved Down)
      console.log(chalk.blue('\n--- Step 4: Browser Extension ---'));
      // Browser check is mostly instructional, verbose logger might not be needed unless we add more checks later
      const browserPassed = await checkBrowserExtension();
      // We might not set allChecksPassed to false here if it's just a manual guide + prompt
      // Let the prompt handle confirmation.


      // --- Step 5: Validation --- (Only if Babel passed, others are guided)
      if (babelPassed) { // Only proceed to validation if core Babel setup is likely correct
        console.log(chalk.green.bold('\n⚙️ Core setup checks complete. Proceeding to guided steps & validation...'));
        // Re-check vscode/browser confirmation within their functions using inquirer
        // Pass logger in case validation adds verbose logs later
        const vscodeConfirmed = await checkVSCodeExtension();
        const browserConfirmed = await checkBrowserExtension();

        if (vscodeConfirmed && browserConfirmed) {
           console.log(chalk.blue('\n--- Step 5: Final Validation ---'));
           await runValidation(verboseLog); // Pass logger
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
