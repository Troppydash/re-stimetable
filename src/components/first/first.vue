<template>
    <Dialog v-if="isOpen" is-open="true"
            title="Getting Started"
            option2="I am experienced!" :on-option2="close">
        <div class="first">

            <p class="st-text st-text--120">Hello new user, I need to ask you some questions before we can see your timetable!</p>
            <br/>
            <br/>
            <p>What is your name?</p>
            <input class="st-input st-input--wider" v-model="details.name" placeholder="Mr. Playwright...">
            <br/>
            <br/>
            <p>And your school ID number?</p>
            <input class="st-input st-input--wider" v-model="details.id" placeholder="061234...">
            <br/>
            <br/>
            <p class="st-text st-text--primary" v-show="error">error: {{ error }}</p>
            <div v-if="loading">
                <i style="display: inline-block; font-size: 1.75rem" class="ri-loader-4-line st-spin"></i>
            </div>
            <div v-if="success">
                <i class="ri-check-double-line" style="font-size: 1.75rem; color: green"></i>
            </div>
            <br/>
            <button class="st-button st-button--primary"
                    @click="handleView" v-show="success">View my timetable!
            </button>
        </div>
    </Dialog>
</template>

<script>
import Dialog from "../controls/Dialogs/Dialog";
import {WebSettings} from "../../lib/settings";
import {helpers} from "../../lib/helpers";


export default {
    name: "first",
    components: {Dialog},
    props: ["isOpen"],
    data() {
        let queue = [];
        const debounce = helpers.debounce(async (details) => {
            const {name, id} = details;

            // check if name is empty
            if (!name) {
                this.error = "please enter your name";
                return;
            }

            if (!id) {
                return;
            }

            // id contains not numbers
            if (!/^\d+$/.test(id)) {
                this.error = "the id contains non-numbers";
                return;
            }

            // if id does not contain 6 numbers
            if (id.length !== 6) {
                this.error = "the id must contain 6 numbers";
                return;
            }

            // update username
            await this.$store.dispatch('auth/updateAuth', {
                name,
                keycode: '',
            });

            queue.push(null);
            this.success = false;
            this.error = '';
            this.loading = true;
            const [text, ok] = await this.$store.dispatch('auth/setupKeycode', {
                barcode: id,
                keycode: '',
                fname: '',
                lname: '',
                mname: '',
                email: '',
            });

            queue.pop();
            if (queue.length > 0) {
                // race conditions
                return;
            }


            this.loading = false;
            if (ok) {
                this.success = true;
                this.error = '';
            } else {
                this.error = text;
            }
        }, 1000);

        return {
            details: {
                name: "",
                id: "",
            },
            success: false,
            error: false,
            loading: false,

            debouncer: () => debounce
        };
    },
    watch: {
        computedDetails(newValue) {
            const details = JSON.parse(newValue);

            // verify ID
            this.debouncer()(details);
        }
    },
    computed: {
        computedDetails() {
            return JSON.stringify(this.details);
        }
    },
    methods: {
        close() {
            WebSettings.instance.updateSettings('user', {
                visited: true
            });
            this.$emit("update:isOpen", false);
        },
        handleView() {
            WebSettings.instance.updateSettings('user', {
                visited: true
            });

            // navigate to timetable
            this.$router.push({
                name: 'Timetable'
            });
        }
    }
}
</script>

<style scoped lang="less">
@import "../../css/addons";


.first {
    text-align: center;
}
</style>
