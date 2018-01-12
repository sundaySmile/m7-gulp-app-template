import gulp from "gulp";
import postcss from "gulp-postcss";
import babel from "gulp-babel";
import ts from "gulp-typescript";
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import rename from "gulp-rename";
import cleanCSS from "gulp-clean-css";
import del from "del";
import template from "gulp-template";
import browserSync from "browser-sync";

const paths = {
    styles: {
        src: "src/styles/*.css",
        dest: "src/dist/styles"
    },
    scripts: {
        src: "src/scripts/*.js",
        dest: "src/dist/scripts"
    },
    images: {
        src: "src/assets/*.{jpg,jpeg,png}",
        dest: "dist/assets/"
    },
    html: {
        src: "src/*.html",
        dest: "src/dist"
    }
};

/*
 * For small tasks you can export arrow functions
 */
export const clean = () => del(["assets"]);

/*
 * You can also declare named functions and export them as tasks
 */
export function styles() {
    const processors = [
        require("postcss-cssnext"),
        // require("precss"),
        require("postcss-nesting")
        // require("postcss-assets")({
        //     loadPaths: [paths.images.src]
        // })
    ];
    return (
        gulp
        .src(paths.styles.src)
        .pipe(postcss(processors))
        .pipe(cleanCSS())
        // pass in options to the stream
        .pipe(
            rename({
                basename: "main",
                suffix: ".min"
            })
        )
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream())
    );
}
// , { noImplicitAny: true }
const tsProject = ts.createProject('tsconfig.json');

export function scripts() {
    return
			gulp.src(paths.scripts.src)
			// 	.pipe(tsProject())
			// tsProject.src()
			// .pipe(tsProject())
			// .js	
        .pipe(babel())
        .pipe(uglify())
        // .pipe(concat("main.min.js"))
        .pipe(gulp.dest('dist'));
}

export function images() {
    return gulp
        .src(paths.images.src, { since: gulp.lastRun(images) })
        .pipe(imagemin({ optimizationLevel: 5 }))
        .pipe(gulp.dest(paths.images.dest));
}

function html() {
    return gulp
        .src(paths.html.src)
        .pipe(template({ title: "Hello!" }))
        .pipe(gulp.dest(paths.html.dest));
}

/*
 * You could even use `export as` to rename exported tasks
 */
function watchFiles() {
    gulp.watch(paths.scripts.src, scripts).on("change", browserSync.reload);
    gulp.watch(paths.styles.src, styles).on("change", browserSync.reload);
    gulp.watch(paths.images.src, images);
    // gulp.watch(paths.html.src, html).on("change", browserSync.reload);
}
export { watchFiles as watch };

gulp.task("clean", clean);
gulp.task("watch", watchFiles);
gulp.task("servers", () => {
    browserSync.init({
        server: {
            baseDir: "src",
            index: "index.html"
                // routes: {
                //     "/dest": "dist/index.html"
                // }
        },
        proxy: false,
        port: 8031,
        host: "0.0.0.0",
        files: [{
            match: ["./src/*.html", "./dist/*.html"],
            options: {
                ignored: "*.txt"
            }
        }],
        browser: []
    });
    watchFiles();
});
/*
 * Export a default task
 */
// export default build;