import * as exec from "@actions/exec";

import * as brew from "./package_manager/brew";
import * as pip from "./package_manager/pip";

/**
 * Install ROS 2 on a OS X worker.
 */
export async function runOsX() {
	await brew.installBrewDependencies();
	await exec.exec("sudo", [
		"bash",
		"-c",
		'echo "export OPENSSL_ROOT_DIR=$(brew --prefix openssl)" >> ~/.bashrc'
	]);
	await exec.exec("sudo", [
		"bash",
		"-c",
		'echo "export CMAKE_PREFIX_PATH=$CMAKE_PREFIX_PATH:/usr/local/opt/qt" >> ~/.bashrc'
	]);
	await exec.exec("sudo", [
		"bash",
		"-c",
		'echo "export PATH=$PATH:/usr/local/opt/qt/bin" >> ~/.bashrc'
	]);
	await pip.installPython3Dependencies();

	// While rosdep and vcs are available as a Debian package on Ubuntu, they need
	// to be installed through pip on OS X.
	await pip.runPython3PipInstall(["rosdep", "vcstool"]);

	// Initializes rosdep
	await exec.exec("sudo", ["rosdep", "init"]);
}
