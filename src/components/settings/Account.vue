<template>
    <div class="account">
        <p class="st-text st-text--header">Account Details</p>
        <div class="st-section">
            <p class="st-text st-text--section st-section__title">Change your Alias and Keycode</p>
            <form class="st-form st-form--bordered" @submit.prevent="submitUser">
                <div class="st-form__control" style="margin: 0">
                    <label class="st-form__label st-form__label--multi st-form__label--full">
                        <span class="st-text">User Alias:</span>
                        <span class="st-text st-text--70">your custom username</span>
                        <input class="st-input st-input--full" v-model="name"/>
                    </label>
                    <label class="st-form__label st-form__label--multi st-form__label--full">
                        <span class="st-text">Network Keycode:</span>
                        <span class="st-text st-text--70">change only if you know what you are doing</span>
                        <input class="st-input st-input--full" v-model="keycode"/>
                    </label>
                </div>
                <div class="st-form__control">
                    <button class="st-form__submit st-button st-button--primary st-button--fill"
                            type="submit" style="margin-right: 1rem">
                        Change
                    </button>
                    <button class="st-form__submit st-button"
                            type="button"
                            @click="revertUser">
                        Revert
                    </button>
                </div>
            </form>
        </div>

        <div class="st-section">
            <p class="st-text st-text--section st-section__title">Setup your Keycode</p>
            <p class="st-text">Important! One need to setup a "keycode" for the timetable app to work.</p>
            <p class="st-text">To use, enter your information below and press 'setup' - feel free to leave fields
                empty.</p>
            <form class="st-form" style="margin-top: 0.5rem" @submit.prevent="submitSetup">
                <div class="st-form__control st-form__control--small">
                    <label class="st-form__label st-form__label--multi st-form__label--half">
                        <span class="st-text">First Name:</span>
                        <span class="st-text st-text--70">your given first name</span>
                        <input class="st-input st-input--full" v-model="setup.fname"/>
                    </label>
                    <label class="st-form__label st-form__label--multi st-form__label--half">
                        <span class="st-text">Last Name:</span>
                        <span class="st-text st-text--70">your given last name</span>
                        <input class="st-input st-input--full" v-model="setup.lname"/>
                    </label>
                </div>
                <div class="st-form__control st-form__control--small">
                    <label class="st-form__label st-form__label--multi st-form__label--half">
                        <span class="st-text">Middle Name:</span>
                        <span class="st-text st-text--70">your middle name (if any)</span>
                        <input class="st-input st-input--full" v-model="setup.mname"/>
                    </label>
                    <label class="st-form__label st-form__label--multi st-form__label--half">
                        <span class="st-text">Email:</span>
                        <span
                            class="st-text st-text--70">the characters in your school email before '@scotscollege...'</span>
                        <input class="st-input st-input--full" v-model="setup.email"/>
                    </label>
                </div>
                <div class="st-form__control st-form__control--small">
                    <label class="st-form__label st-form__label--multi st-form__label--half">
                        <span class="st-text">Barcode:</span>
                        <span class="st-text st-text--70">the six digit id on your id card</span>
                        <input class="st-input st-input--full" v-model="setup.barcode"/>
                    </label>
                </div>
                <div class="st-form__control">
                    <button class="st-form__submit st-button st-button--primary st-button--fill st-button--icon"
                            type="submit" style="margin-right: 1rem"
                            :disabled="setupLoading">
                        Setup
                        <i v-show="setupLoading" class="ri-loader-4-line st-spin" style="font-size: 1.2rem"></i>
                    </button>
                    <button class="st-form__submit st-button"
                            type="button"
                            @click="clearSetup" :disabled="setupLoading">
                        Clear
                    </button>
                </div>
            </form>
        </div>

        <div class="st-section">
            <p class="st-text st-text--section st-section__title">Manual Keycode Setup</p>
            <p class="st-text">
                If the site cannot automatically detect your keycode, you have to find it yourself.
                Don't worry, it is not complicated and will only require a maximum of two to three minutes.
            </p>
            <br/>
            <button class="st-button st-button--primary"
                    @click="() => setInstructions(true)">
                Open Instructions
            </button>
            <Dialog :is-open="showInstructions" :on-close="() => setInstructions(false)"
                    title="Instructions" option2="I am Done" :on-option2="() => setInstructions(false)">
                <div class="st-section">
                    <p class="st-text st-text--section st-section__title">Step 1: Log into PCSchool Spider</p>
                    <p class="st-text">
                        Visit the link
                        <a class="st-text st-text--link" target="_blank"
                           href="https://spider.scotscollege.school.nz/Spider2011/Pages/Login.aspx?ReturnUrl=/Spider2011/Pages/Home.aspx">https://spider.scotscollege.school.nz/Spider2011/Pages/Login.aspx?ReturnUrl=/Spider2011/Pages/Home.aspx</a>,
                        <br/>
                        then sign in with your credentials.
                    </p>
                </div>

                <div class="st-section">
                    <p class="st-text st-text--section st-section__title">Step 2: Open the Developer Tools</p>
                    <p class="st-text">
                        Press the key F12 on the page, a window called the DevTools should pop up.
                        <br/>
                        Click on the Network tab on the DevTools.
                    </p>
                    <br/>
                    <p class="st-text">The DevTools should look like this</p>
                    <img src="/img/instructions/step2.png" width="600"/>
                </div>

                <div class="st-section">
                    <p class="st-text st-text--section st-section__title">Step 3: Navigate to the Student
                        Information</p>
                    <p>
                        On the website (not the DevTools), click on the link labeled 'Student Information'. This should
                        bring
                        you to your information page.
                    </p>
                </div>

                <div class="st-section">
                    <p class="st-text st-text--section st-section__title">Step 4: Get your keycode from a Request</p>
                    <p>
                        The DevTools should now have a lot of colors and text.
                        <br/>
                        Select the network request labeled "GetStudent_ByStudentKeyW" by clicking on it.
                        Scroll to the bottom on the tab "Headers", your keycode should be next to the label "StudentKey"
                    </p>
                    <br/>
                    <p class="st-text">The DevTools Panel after Navigation</p>
                    <img src="/img/instructions/step4.png" width="600"/>

                    <p class="st-text">Where the keycode is, here "QI T" (without the quotes) is the keycode</p>
                    <img src="/img/instructions/step4-1.png" width="600"/>
                </div>

                <div class="st-section">
                    <p class="st-text st-text--section st-section__title">Step 5: Enter your keycode</p>
                    <p class="st-text">Close this dialog, and in the section "Change your Alias and Keycode" under
                        Account,
                        enter your new keycode at the input labeled "Network Keycode", and press "Change". Head back to
                        TIMETABLE to see your timetable!</p>
                </div>
            </Dialog>
        </div>
    </div>
</template>

<script lang="ts">

import {defineComponent} from "vue";
import Dialog from "@/components/controls/Dialogs/Dialog.vue";
import alerts from "@/lib/mixins/alerts";

export default defineComponent({
    name: "Account",
    components: {Dialog},
    mixins: [alerts],
    data() {
        return {
            name: '',
            keycode: '',

            setup: {
                barcode: '',
                fname: '',
                lname: '',
                mname: '',
                email: ''
            },
            setupLoading: false,

            showInstructions: false,
        }
    },
    computed: {
        auth(): any {
            return this.$store.getters['auth/auth'];
        }
    },
    methods: {
        setInstructions(doesShow: boolean) {
            this.showInstructions = doesShow;
        },
        async submitUser() {
            await this.$store.dispatch('auth/updateAuth', {
                name: this.name,
                keycode: this.keycode,
            });
            this.alert({
                title: 'Update Success',
                text: 'Your Alias and Keycode has been updated'
            });
        },
        revertUser() {
            this.name = this.auth.name;
            this.keycode = this.auth.keycode;
        },
        async submitSetup() {
            this.setupLoading = true;

            const [text, ok] = await this.$store.dispatch('auth/setupKeycode', this.setup);
            if (ok) {
                this.alert({
                    title: 'Setup Success',
                    text: 'Head to TIMETABLE to view your timetable'
                }, 5000);
                this.revertUser();
            } else {
                this.alert({
                    title: 'Setup Failure',
                    text: `Reason: '${text}'\nRefer the section 'Manual Keycode Setup' for more information`
                }, 5000);
            }

            this.setupLoading = false;
        },
        clearSetup() {
            this.setup = {
                barcode: '',
                fname: '',
                lname: '',
                mname: '',
                email: ''
            };
        }
    },
    mounted() {
        this.revertUser();
    }
})
</script>

<style lang="less" scoped>
@import "../../css/addons";

img {
    max-width: 100%;
    height: auto;
}

.st-form__label--half {
    width: 50%;
}

@media screen and (max-width: 1024px) {
    .st-form__label--half {
        width: 100%;
    }
}
</style>
